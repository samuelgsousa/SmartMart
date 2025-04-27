from fastapi import FastAPI, status, Response, UploadFile, File, HTTPException
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


@app.get("/produtos/", response_model=List[ProdutoResponse])
async def listar_produtos(price_min: float = None):  
    db = SessionLocal()
    query = db.query(ProdutoDB)
    
    if price_min:
        query = query.filter(ProdutoDB.price >= price_min) 
    
    produtos = query.all()
    db.close()
    
    return produtos


@app.post("/produtos/", response_model=ProdutoResponse)
async def criar_produto(produto: ProdutoCreate): 
    db = SessionLocal()
    
    # Convertendo o modelo Pydantic para SQLAlchemy
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

@app.put("/produtos/{produto_id}", response_model=ProdutoResponse)
async def atualizar_produto(
    produto_id: int, 
    produto: ProdutoCreate  # Reutiliza o modelo de criação (todos campos obrigatórios)
):
    db = SessionLocal()
    
    # Busca o produto no banco
    db_produto = db.query(ProdutoDB).filter(ProdutoDB.id == produto_id).first()
    
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Atualiza todos os campos
    db_produto.name = produto.name
    db_produto.description = produto.description
    db_produto.price = produto.price
    db_produto.category_id = produto.category_id
    db_produto.brand = produto.brand
    
    db.commit()
    db.refresh(db_produto)
    db.close()
    
    return db_produto

@app.delete("/produtos/{produto_id}")
async def excluir_produto(produto_id: int):
    db = SessionLocal()
    
    # Busca o produto no banco
    db_produto = db.query(ProdutoDB).filter(ProdutoDB.id == produto_id).first()
    
    if not db_produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto com ID {produto_id} não encontrado"
        )
    
    # Remove o produto
    db.delete(db_produto)
    db.commit()
    db.close()
    
    return {"mensagem": f"Produto ID {produto_id} excluído com sucesso"}
