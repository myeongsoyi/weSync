from pydantic import BaseModel
from typing import Optional

class ScoreResponseDTO(BaseModel):
    score_url: str
    accompaniment_url: Optional[str] = None
    position_name: Optional[str] = None
    color_code: Optional[str] = None
