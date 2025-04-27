from fastapi import FastAPI, status, Response, UploadFile, File, HTTPException
from pydantic import BaseModel
import csv
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from produtos import router as produtos_router


app = FastAPI()
app.include_router(produtos_router)

@app.get("/")
def home():
    return {"message": "API SmartMart Online!"}
