from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, relationship, joinedload
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, Base
from sqlalchemy import Column, ForeignKey, Integer, String, Float

# --- Modelo SQLAlchemy ---
class ProdutoDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    brand = Column(String(45))
    sales = relationship("SaleDB", back_populates="produto")
    category = relationship("CategoryDB", back_populates="produto")

# --- Schemas Pydantic ---

class ProdutoBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    brand: str

class ProdutoCreate(ProdutoBase):
    pass
    # name: str
    # description: Optional[str] = None
    # price: float
    # category_id: int
    # brand: str

class ProdutoResponse(ProdutoBase):
    id: int
    category_name: str

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

    # Cria o produto
    novo_produto = ProdutoDB(**produto.model_dump())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)

    # Carrega a relação explicitamente
    db.refresh(novo_produto, ["category"])
    
    return ProdutoResponse(
        **novo_produto.__dict__,
        category_name=novo_produto.category.name
    )

@router.get("/", response_model=List[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db), price_min: float = None):
    
    query = (
        db.query(ProdutoDB)
            .options(joinedload(ProdutoDB.category))
    )

    if price_min:
        query = query.filter(ProdutoDB.price >= price_min)

    produtos = query.all()

  #  return query.all()
    return [
        ProdutoResponse(
            id=produto.id,
            name=produto.name,
            description=produto.description,
            price=produto.price,
            category_id=produto.category_id,
            brand=produto.brand,
            category_name=produto.category.name if produto.category else "Sem categoria"
        )
        for produto in produtos
    ]

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

    # Carrega a relação explicitamente
    db.refresh(db_produto, ["category"])
    
    return ProdutoResponse(
        **db_produto.__dict__,
        category_name=db_produto.category.name
    )

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

