from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, Base, engine
from sqlalchemy import Column, Integer, Date, Float
from datetime import date 

# --- Modelo SQLAlchemy ---
class SaleDB(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer)
    quantity = Column(Integer)
    total_price = Column(Float)
    date = Column(Date)

# --- Schemas Pydantic ---
class SaleCreate(BaseModel):
    product_id: int
    quantity: int
    total_price: float
    date: date

class SaleResponse(SaleCreate):
    id: int
    class Config:
        from_attributes = True

# --- Rotas ---

router = APIRouter(prefix="/sales", tags=["sales"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=SaleResponse)
def criar_venda(venda: SaleCreate, db: Session = Depends(get_db)):
    nova_venda = SaleDB(**venda.model_dump())

    db.add(nova_venda)
    db.commit()
    db.refresh(nova_venda)
    return nova_venda