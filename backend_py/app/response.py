from pydantic import BaseModel
from typing import Optional, Union

class ErrorResponse(BaseModel):
    errorCode: int
    errorMessage: str

class BaseResponse(BaseModel):
    success: bool
    data: Optional[Union[dict,list]] = None
    error: Optional[ErrorResponse] = None

def CommonResponse(success: bool, data: Optional[dict]=None, errorCode: Optional[int]=None, errorMessage: Optional[str]=None):
    return BaseResponse(
        success=success,
        data=data,
        error=ErrorResponse(errorCode=errorCode, errorMessage=errorMessage)
    )