from fastapi import UploadFile
import fitz
import tempfile
import shutil
import os
import cv2
import uuid
import scoreRecognition.denoise as dn
from mido import MidiFile, MidiTrack, MetaMessage
import scoreRecognition.predict as pd
import scoreRecognition.score2midi as stm
from pydub import AudioSegment
from concurrent.futures import ThreadPoolExecutor
import scoreRecognition.upload as up
import scoreRecognition.createOutput as co
from sqlalchemy.orm import Session
from app.models import *

executor = ThreadPoolExecutor(max_workers=4)

def recognition(file: UploadFile, team_id: int, db: Session):
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    doc = fitz.open(temp_file_path)
    file_name = uuid.uuid4()
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
    
        output_path = f"{os.getcwd()}/scoreRecognition/Output"

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
                    stm.word2midi(mid, track, words, melody)
                
                if not os.path.exists(f"{output_path}/midi"):
                    os.mkdir(f"{output_path}/midi")

                # MIDI 파일 저장
                mid.save(f'{output_path}/midi/{file_name}_part{i}.mid')

                if not os.path.exists(f"{output_path}/lily"):
                    os.mkdir(f"{output_path}/lily")

                co.midi_to_ly(f'{output_path}/midi/{file_name}_part{i}.mid', f'{output_path}/lily/{file_name}_part{i}.ly')

                if not os.path.exists(f"{output_path}/img"):
                    os.mkdir(f"{output_path}/img")

                co.ly_to_png( f'{output_path}/lily/{file_name}_part{i}.ly',  f'{output_path}/img/{file_name}_part{i}')

                up.upload_file_to_s3(f'{output_path}/img/{file_name}_part{i}.png', "scoreOutput/png/", f"{file_name}_part{i}.png")

                db_img = Score(part_num = i, position_id = None, title = file_name, \
                            score_url = f'https://{os.getenv("cloud_aws_s3_bucket")}.s3.{os.getenv("cloud_aws_region_static")}.amazonaws.com/{"scoreOutput/png/"}{file_name}_part{i}.png',\
                            team_id = team_id )
                try:
                    db.add(db_img)
                    print("db.add passed")
                    db.commit()
                    print("db.commit passed")
                except Exception as e:
                    print(f"Exception: {e}")

                if not os.path.exists(f"{output_path}/accom"):
                    os.mkdir(f"{output_path}/accom")

                co.convert_midi_to_wav(f'{output_path}/midi/{file_name}_part{i}.mid', f'{output_path}/accom/{file_name}_part{i}.wav')

                up.upload_file_to_s3(f'{output_path}/accom/{file_name}_part{i}.wav', "scoreOutput/wav/", f"{file_name}_part{i}.wav")

                db_accom = Accompaniment(score_id = db_img.score_id, \
                                         accompaniment_url = f'https://{os.getenv("cloud_aws_s3_bucket")}.s3.{os.getenv("cloud_aws_region_static")}.amazonaws.com/{"scoreOutput/wav/"}{file_name}_part{i}.wav')
                try:
                    db.add(db_accom)
                    print("db.add passed")
                    db.commit()
                    print("db.commit passed")
                except Exception as e:
                    print(f"Exception: {e}")

        except Exception as e:
            print(e.args) # 오류
        finally:
            shutil.rmtree(output_path)
            shutil.move(temp_output_folder, output_path)
    except Exception as e:
        print(e.args) # 오류
    finally:
        shutil.rmtree(input_path)
        shutil.move(temp_input_folder, input_path)
    
    doc.close()
    os.remove(temp_file_path)
