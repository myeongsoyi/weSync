from fastapi import UploadFile
import fitz
import tempfile
import shutil
import os
import cv2
import scoreRecognition.denoise as dn
from mido import MidiFile, MidiTrack, MetaMessage
import scoreRecognition.predict as pd
import scoreRecognition.score2midi as stm
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor
from music21 import *
import subprocess

executor = ThreadPoolExecutor(max_workers=4)

async def recognition(file: UploadFile):
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    doc = fitz.open(temp_file_path)
    file_name = file.filename.split('.')[0]
    input_path = "./scoreRecognition/Input"

    if not os.path.exists(f"{input_path}"):
                os.mkdir(f"{input_path}")

    temp_input_folder = f"{input_path}_backup"
    shutil.copytree(input_path, temp_input_folder)

    try: # input 악보 가공
        if not os.path.exists(f"{input_path}/{file_name}"):
            os.mkdir(f"{input_path}/{file_name}") # 파일의 각 페이지를 저장하기 위한 폴더
        resource_path = f"{input_path}/{file_name}"
        page_cnt = 0

        for i, page in enumerate(doc):
            img = page.get_pixmap()
            img.save(f"{resource_path}/{i}.png") # 각 페이지 png 파일으로 저장
            page_cnt += 1

        if not os.path.exists(f"{input_path}/{file_name}/crop"):
            os.mkdir(f"{input_path}/{file_name}/crop")

        resource_path = f"{input_path}/{file_name}"
        for i in range(page_cnt):
            img = cv2. imread(f"{resource_path}/{i}.png")
            dn.dnImg(img, f"{resource_path}/crop")

        # 파트별 악보 분리
        box_cnt = len(os.listdir(f"{resource_path}/crop"))
        if not os.path.exists(f"{input_path}/{file_name}/part"):
            os.mkdir(f"{input_path}/{file_name}/part")

        for i in range(box_cnt):
            img = cv2. imread(f"{resource_path}/crop/{i}.png")
            dn.split_part(img, f"{resource_path}/part", i)
    
        output_path = "./scoreRecognition/Output"

        if not os.path.exists(f"{output_path}"):
                    os.mkdir(f"{output_path}")

        temp_output_folder = f"{output_path}_backup"
        shutil.copytree(output_path, temp_output_folder)
        
        try: #output 생성
            # 악보 데이터 인식
            resource_path = f"{resource_path}/part"
            part_num = len(os.listdir(resource_path))

            for i in range (part_num):
                mid = MidiFile() # 새 MIDI 파일 생성
                mid.ticks_per_beat = 480

                track = MidiTrack()
                mid.tracks.append(track)

                bpm = 128 # BPM
                microseconds_per_beat = int(60000000 / bpm)

                track.append(MetaMessage('set_tempo', tempo=microseconds_per_beat))

                melody = AudioSegment.silent(duration=0)

                for j in range(box_cnt):
                    words = pd.decode_score(f'{resource_path}/{i}/{j}.png', 
                                    './scoreRecognition/Models/semantic_model/semantic_model.meta', 
                                    './scoreRecognition/Data/vocabulary_semantic.txt')
                    melody = stm.word2midi(mid, track, words, melody)
                
                if not os.path.exists(f"{output_path}/midi"):
                    os.mkdir(f"{output_path}/midi")

                # MIDI 파일 저장
                mid.save(f'{output_path}/midi/{file_name}_part{i}.mid')

                if not os.path.exists(f"{output_path}/accom"):
                    os.mkdir(f"{output_path}/accom")

                # 반주 파일 저장
                # melody += 20
                # melody.export(f"{output_path}/accom/{file_name}_part{i}.wav", format="wav")

                if not os.path.exists(f"{output_path}/img"):
                    os.mkdir(f"{output_path}/img")

                # MuseScore의 경로 설정 (환경에 따라 변경 필요)
                environment.set('musescoreDirectPNGPath', '/usr/bin/musescore.appimage')

                # MIDI 파일 로드
                midi_path = f'{output_path}/midi/{file_name}_part{i}.mid'
                score = converter.parse(midi_path)

                # 악보 이미지로 저장
                score.write('musicxml.png', fp = f"{output_path}/img/{file_name}_part{i}.png")

                # MIDI 파일과 출력될 오디오 파일의 경로
                midi_path = f'{output_path}/midi/{file_name}_part{i}.mid'
                audio_path = f"{output_path}/accom/{file_name}_part{i}.wav"

                # MuseScore의 경로 및 변환 명령어 실행
                musescore_path = '/usr/bin/mscore3'
                subprocess.run([musescore_path, midi_path, '--export-to', audio_path])

        except Exception as e:
            print(e.args) # 오류
        finally:
            # shutil.rmtree(output_path)
            # shutil.move(temp_output_folder, output_path)
            pass
    except Exception as e:
        pass # 오류
    finally:
        # shutil.rmtree(temp_input_folder)
        shutil.rmtree(input_path)
        shutil.move(temp_input_folder, input_path)
    
    doc.close()
    os.remove(temp_file_path)