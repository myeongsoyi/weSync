from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database
from app.router import rScore

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rScore)

@app.on_event("startup")
def startup_event():
    database.create_tables()
