from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base, BaseTimeEntity

class Team(Base, BaseTimeEntity):
    __tablename__ = "team"

    team_id = Column(Integer, primary_key=True)
    team_name = Column(String(30), nullable=False)
    song_name = Column(String(30), nullable=True)
    profile_url = Column(String(255), nullable=True)
    is_finished = Column(Boolean, nullable=False)
    team_leader_id = Column(Integer, nullable=False)
    scores = relationship("Score", back_populates="team")
    positions = relationship("Position", back_populates="team")

class Score(Base, BaseTimeEntity):
    __tablename__ = "score"

    score_id = Column(Integer, primary_key=True)
    part_num = Column(Integer, nullable=False)
    position_id = Column(Integer, ForeignKey("position.position_id"))
    position = relationship("Position", back_populates="score")
    team_id = Column(Integer, ForeignKey("team.team_id"))
    team = relationship("Team", back_populates="scores")
    title = Column(String(30), nullable=False)
    url = Column(String(255), nullable=False)
    accompainment = relationship("Accompainment", back_populates="score", uselist=False)


class Accompainment(Base, BaseTimeEntity):
    __tablename__ = "accompainment"

    accompainment_id = Column(Integer, primary_key=True)
    score_id = Column(Integer, ForeignKey("score.score_id"))
    score = relationship("Score", back_populates="accompainment")
    title = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)

class Position(Base, BaseTimeEntity):
    __tablename__ = "position"

    position_id = Column(Integer, primary_key=True)
    position_name = Column(String(30), nullable=False)
    team_id = Column(Integer, ForeignKey("team.team_id"))
    team = relationship("Team", back_populates="positions")
    color_id = Column(Integer, ForeignKey("color.color_id"))
    color = relationship("Color", back_populates="position")
    score = relationship("Score", back_populates="position")

class Color(Base, BaseTimeEntity):
    __tablename__ = "color"

    color_id = Column(Integer, primary_key=True)
    color_name = Column(String(255), nullable=False)
    color_code = Column(String(255), nullable=False)
    position = relationship("Position", back_populates="color", uselist=False)
