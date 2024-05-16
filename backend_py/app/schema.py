from pydantic import BaseModel



class ScoreResponseDTO(BaseModel):
    score_url: str
    accompainment_url: str
    position_name: str
    color_code: str
