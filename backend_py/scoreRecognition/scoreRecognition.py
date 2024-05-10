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

async def recognition(file: UploadFile):
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    doc = fitz.open(temp_file_path)
    file_name = file.filename.split('.')[0]
    page_path = "./scoreRecognition/Input"

    if not os.path.exists(f"{page_path}/{file_name}"):
        os.mkdir(f"{page_path}/{file_name}") # 파일의 각 페이지를 저장하기 위한 폴더
    resource_path = f"{page_path}/{file_name}"
    page_cnt = 0

    for i, page in enumerate(doc):
        img = page.get_pixmap()
        img.save(f"{resource_path}/{i}.png") # 각 페이지 png 파일으로 저장
        page_cnt += 1

    if not os.path.exists(f"{page_path}/{file_name}/crop"):
        os.mkdir(f"{page_path}/{file_name}/crop")

    resource_path = f"{page_path}/{file_name}"
    for i in range(page_cnt):
        img = cv2. imread(f"{resource_path}/{i}.png")
        dn.dnImg(img, f"{resource_path}/crop")

    # 파트별 악보 분리
    box_cnt = len(os.listdir(f"{resource_path}/crop"))
    if not os.path.exists(f"{page_path}/{file_name}/part"):
        os.mkdir(f"{page_path}/{file_name}/part")

    for i in range(box_cnt):
        img = cv2. imread(f"{resource_path}/crop/{i}.png")
        dn.split_part(img, f"{resource_path}/part", i)
    
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

        for j in range(box_cnt):
            words = pd.decode_score(f'{resource_path}/{i}/{j}.png', 
                            './scoreRecognition/Models/semantic_model/semantic_model.meta', 
                            './scoreRecognition/Data/vocabulary_semantic.txt')
            stm.word2midi(mid, track, words)
        
        if not os.path.exists(f"./scoreRecognition/Output/midi"):
            os.mkdir(f"./scoreRecognition/Output/midi")

        # MIDI 파일 저장
        mid.save(f'./scoreRecognition/Output/midi/{file_name}_part{i}.mid')


    doc.close()
    os.remove(temp_file_path)