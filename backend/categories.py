from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, Base, engine
from sqlalchemy import Column, Integer, String, Float

# --- Modelo SQLAlchemy ---
class Categories(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45))