from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import enum

# DATABASE_URL = "mysql+pymysql://root:deer4@localhost:3306/wesync?allowPublicKeyRetrieval=true"
DATABASE_URL = "mysql+pymysql://root:weSyncAdmin@k10a310.p.ssafy.io:3306/we_sync"

engine = create_engine( DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

class Deleter(enum.Enum):
    ADMIN= "admin"
    NORMAL= "normal"

class BaseTimeEntity:
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)
    deleted_by = Column(Enum(Deleter), nullable=True, default=None)
