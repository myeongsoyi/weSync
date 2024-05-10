from fastapi import APIRouter, File, UploadFile
from app.response import BaseResponse
from app.response import CommonResponse

rScore = APIRouter(prefix="/py-api/score")

@rScore.post('/', tags = ['score'], response_model=BaseResponse)
def upload_score(file: UploadFile = File(...)):
    if(file == None): # 파일을 전송받지 못한 경우
        return CommonResponse(False, None, 400, "파일 업로드에 실패했습니다. 다시 시도해주세요.")
    if(file.content_type != "application/pdf"): # 지원하지 않는 파일 형식
        return CommonResponse(False, None, 400, f"{file.content_type.split('/')[1]} 파일 형식을 지원하지 않습니다.")
    # 악보 인식

    # 악보 이미지 s3 저장

    # 반주 s3 저장
    
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
def get_scores():
    pass

@rScore.delete('/{team_id}', tags = ['score'], response_model=BaseResponse)
def delete_scores():
    pass
