from sqlalchemy.orm import Session
from app.models import Score
from app.schema import ScoreCreate

def get_scores(db: Session):
    return db.query(Score).all()

def get_score(db: Session, score_id: int):
    return db.query(Score).filter(Score.score_id == score_id).first()

def create_score(db: Session, score: ScoreCreate):
    db_score = Score(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def update_score(db: Session, score: Score, updated_score: ScoreCreate):
    for key, value in updated_score.dict().items():
        setattr(score, key, value)
    db.commit()
    db.refresh(score)
    return score

def delete_score(db: Session, score: Score):
    db.delete(score)
    db.commit()