from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, Base
from sqlalchemy import Column, Integer, String, Float

# --- Modelo SQLAlchemy ---
class ProdutoDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer)
    brand = Column(String(45))
    sales = relationship("SaleDB", back_populates="produto")

# --- Schemas Pydantic ---
class ProdutoCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    brand: str

class ProdutoResponse(ProdutoCreate):
    id: int
    class Config:
        from_attributes = True

# --- Rotas ---
router = APIRouter(prefix="/produtos", tags=["produtos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProdutoResponse)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    novo_produto = ProdutoDB(**produto.model_dump())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@router.get("/", response_model=List[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db), price_min: float = None):
    query = db.query(ProdutoDB)
    if price_min:
        query = query.filter(ProdutoDB.price >= price_min)
    return query.all()

@router.put("/{produto_id}", response_model=ProdutoResponse)
async def atualizar_produto(produto_id: int, produto: ProdutoCreate):
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

@router.delete("/{produto_id}")
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

