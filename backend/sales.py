from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload, relationship
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal, Base, engine
from sqlalchemy import Column, Integer, Date, Float, ForeignKey
from datetime import date 

# --- Modelo SQLAlchemy ---
class SaleDB(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer)
    total_price = Column(Float)
    date = Column(Date)
    produto = relationship("ProdutoDB", back_populates="sales")

# --- Schemas Pydantic ---
class SaleBase(BaseModel):
    product_id: int
    quantity: int
    total_price: float
    date: date

class SaleCreate(SaleBase):
    pass

class SaleCreateResponse(SaleBase):
    id: int

    class Config:
        orm_mode = True

class SaleRead(SaleBase):
    id: int
    product_name: str   # só o GET precisa disso

    class Config:
        orm_mode = True
        

# --- Rotas ---

router = APIRouter(prefix="/sales", tags=["sales"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[SaleRead])
def listar_vendas(db: Session = Depends(get_db)):

    sales = (
        db.query(SaleDB)
          .options(joinedload(SaleDB.produto))  # carrega o produto junto
          .all()
          )

    return [
        SaleRead(
            id=s.id,
            product_id=s.product_id,
            quantity=s.quantity,
            total_price=s.total_price,
            date=s.date,
            product_name=s.produto.name
        )
        for s in sales
    ]

    query = db.query(SaleDB)
    return query.all()

@router.post("/", response_model=SaleCreateResponse)
def criar_venda(venda: SaleCreate, db: Session = Depends(get_db)):
    nova_venda = SaleDB(**venda.model_dump())

    db.add(nova_venda)
    db.commit()
    db.refresh(nova_venda)
    return nova_venda

@router.put("/{venda_id}", response_model=SaleBase)
async def atualizar_venda(venda_id: int, venda: SaleCreate):
    db = SessionLocal()
    
    # Busca a venda no banco
    db_sale = db.query(SaleDB).filter(SaleDB.id == venda_id).first()

    if not db_sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    
    db_sale.product_id = venda.product_id
    db_sale.quantity = venda.quantity
    db_sale.total_price = venda.total_price
    db_sale.date = venda.date
    

    db.commit()
    db.refresh(db_sale)
    db.close()
    
    return db_sale

@router.delete("/{venda_id}")
async def excluir_venda(venda_id: int):
    db = SessionLocal()
    
    # Busca a venda no banco
    db_sale = db.query(SaleDB).filter(SaleDB.id == venda_id).first()

    if not db_sale:
        raise HTTPException(status_code=404, detail=f"Venda com ID {venda_id} não encontrada")
    
    db.delete(db_sale)
    db.commit()
    db.close()

    return {"mensagem": f"Venda com ID {venda_id} excluída com sucesso", "status": "ok"}

