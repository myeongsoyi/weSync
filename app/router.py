from fastapi import APIRouter, File

rScore = APIRouter(prefix="/api/score")

@rScore.post('/', tags = ['score'])
async def upload_score(file: bytes = File()):
    # pdf 파일 받기

    # 받았다는 메시지 전송

    # 악보 인식

    # 악보 이미지 s3 저장

    # 반주 s3 저장
    
    pass

@rScore.get('/{team_id}', tags = ['score'])
def get_scores():
    pass

@rScore.delete('/{team_id}', tags = ['score'])
def delete_scores():
    pass