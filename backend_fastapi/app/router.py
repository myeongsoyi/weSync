from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from app.response import BaseResponse
from sqlalchemy.orm import Session
from app.response import CommonResponse
from scoreRecognition.scoreRecognition import recognition
import scoreRecognition.createOutput as co
import scoreRecognition.upload as up
from app import database
from app.models import *

import os

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

rScore = APIRouter(prefix="/py-api/score")

@rScore.post('/{team_id}', tags = ['score'], response_model=BaseResponse)
def upload_score(team_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if(file == None): # 파일을 전송받지 못한 경우
        return CommonResponse(False, None, 400, "파일 업로드에 실패했습니다. 다시 시도해주세요.")
    
    if(file.content_type != "application/pdf"): # 지원하지 않는 파일 형식
        return CommonResponse(False, None, 400, f"{file.content_type.split('/')[1]} 파일 형식을 지원하지 않습니다.")

    scores = db.query(Score).filter(Score.team_id == team_id).filter(Score.is_deleted == False).all()

    if scores:
        return CommonResponse(False, None, 400, "이미 악보가 등록되었습니다.")
    
    recognition(file, team_id, db)

    db.close()
    
    return CommonResponse(
        True,
        {
            "filename": file.filename,
            "content_type": file.content_type,
            "messgae": f"{file.content_type.split('/')[1]} 형식의 파일이 업로드 되었습니다."
        },
        200, "파일 전송 성공!"
        )

@rScore.get('/{team_id}', tags = ['score'], response_model=BaseResponse)
def get_scores(team_id: int, db: Session = Depends(get_db)):
    scoreData = db.query(Score.score_id, Score.score_url, Accompaniment.accompaniment_url, Position.position_name, Color.color_code)\
        .outerjoin(Accompaniment, Score.score_id == Accompaniment.score_id)\
        .outerjoin(Position, Score.position_id == Position.position_id)\
        .outerjoin(Color, Position.color_id == Color.color_id)\
        .filter(Score.team_id==team_id)\
        .filter(Score.is_deleted==False)\
        .all()
    
    score_dicts = []
    for row in scoreData:
        row_dict = {
            "score_id": row[0],
            "score_url": row[1],
            "accompaniment_url": row[2],
            "position_name": row[3],
            "color_code": row[4]
        }
        score_dicts.append(row_dict)

    if score_dicts == []:
        return CommonResponse(True, [], 400, "조회된 악보가 없습니다.")

    return CommonResponse(True, score_dicts, 200, "조회 성공!")

@rScore.delete('/{team_id}', tags=['score'], response_model=BaseResponse)
def delete_scores(team_id: int, db: Session = Depends(get_db)):
    scores = db.query(Score).filter(Score.team_id == team_id).filter(Score.is_deleted == 0).all()

    if not scores:
        return CommonResponse(False, None, 400, "삭제할 악보가 없습니다.")
    
    print(scores[0])

    try:
        for score in scores:
            print("*before => ", score)
            score.is_deleted = 1
            if score.accompaniment:
                score.accompaniment.is_deleted = 1
            print("  *after => ", score)
            try:
                db.commit()
            except Exception as e:
                db.rollback()  # 예외 발생 시 롤백
                return CommonResponse(False, None, 400, "DB commit에 실패했습니다. 다시 시도해 주세요.")
    except Exception as e:
        print(e)
    finally:
        db.close()

    return CommonResponse(
        True,
        {
            "message": "악보 삭제 성공"
        },
        200, "악보 삭제 성공!"
    )

@rScore.post('/{team_id}/{part_num}', tags = ['score'], response_model=BaseResponse)
def create_new_score(team_id: int, part_num: int, db: Session = Depends(get_db)):

    db_img = Score(part_num = part_num, position_id = None, title = None, \
                score_url = None,\
                team_id = team_id )
    try:
        db.add(db_img)
        db.commit()
    except Exception as e:
        print(f"Exception: {e}")

    return CommonResponse( True, {"message":"빈 악보 생성"}, 200, "빈 악보 생성 성공!" )