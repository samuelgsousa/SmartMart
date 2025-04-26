from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import csv
from typing import List

from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()


# Configuração da conexão
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:4224@localhost:3306/SmartMart"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class ProdutoDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer)
    brand = Column(String(45))

# Modelo para CRIAÇÃO de produtos
class ProdutoCreate(BaseModel):
    name: str
    description: str
    price: float
    category_id: int
    brand: str


class ProdutoResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category_id: int
    brand: str

    class Config:
        from_attributes = True  


@app.post("/produtos/", response_model=ProdutoResponse)
async def criar_produto(produto: ProdutoCreate):  # Altere para ProdutoCreate
    db = SessionLocal()
    
    # Converta o modelo Pydantic para SQLAlchemy
    db_produto = ProdutoDB(
        name=produto.name,
        description=produto.description,
        price=produto.price,
        category_id=produto.category_id,
        brand=produto.brand
    )
    
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    db.close()
    
    return db_produto

@app.get("/produtos/", response_model=List[ProdutoResponse])
async def listar_produtos(price_min: float = None):  # Altere o parâmetro para "price_min"
    db = SessionLocal()
    query = db.query(ProdutoDB)
    
    if price_min:
        query = query.filter(ProdutoDB.price >= price_min)  # Use "price", não "preco"
    
    produtos = query.all()
    db.close()
    
    return produtos