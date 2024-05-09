from pydantic import BaseModel

class ScoreBase(BaseModel):
    position_id: int
    team_id: int
    title: str
    url: str

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    score_id: int

    class Config:
        orm_mode=True
