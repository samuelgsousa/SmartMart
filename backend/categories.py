from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, Base, engine
from sqlalchemy import Column, Integer, String, Float

# --- Modelo SQLAlchemy ---
class CategoryDB(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45))

# --- Schemas Pydantic ---
class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(CategoryCreate):
    id: int
    class Config:
        from_attributes = True

# --- Rotas ---

router = APIRouter(prefix="/categories", tags=["categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[CategoryResponse])
def listar_categorias(db: Session = Depends(get_db)):
    query = db.query(CategoryDB)
    return query.all()

@router.post("/", response_model=CategoryResponse)
def criar_categoria(categoria: CategoryCreate, db: Session = Depends(get_db)):
    nova_categoria = CategoryDB(**categoria.model_dump())
    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)
    return nova_categoria