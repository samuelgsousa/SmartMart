from fastapi import FastAPI, status, Response, UploadFile, File, HTTPException
from pydantic import BaseModel
import csv
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from produtos import router as produtos_router
from categories import router as categories_router
from sales import router as sales_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://smart-mart-one.vercel.app"
    # Depois adicionar outros domínios/deploys aqui:
    # Ex: "https://meu-app.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        
    allow_credentials=True,        
    allow_methods=["*"],    
    allow_headers=["*"],
    expose_headers=["*"] 
)


app.include_router(produtos_router)
app.include_router(categories_router)
app.include_router(sales_router)

@app.get("/")
def home():
    return {"message": "API SmartMart Online!"}
