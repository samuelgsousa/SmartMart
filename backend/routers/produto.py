from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List

from models.produto import ProdutoDB
from schemas.produto import ProdutoCreate, ProdutoResponse
from database.connection import get_db

router = APIRouter(prefix="/produtos", tags=["produtos"])

@router.post("/", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED)
async def criar_produto(
    produto: ProdutoCreate, 
    db: Session = Depends(get_db)
):
    """Cria um novo produto no banco de dados"""
    db_produto = ProdutoDB(**produto.model_dump())
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

@router.get("/", response_model=List[ProdutoResponse])
async def listar_produtos(
    price_min: float = None,
    db: Session = Depends(get_db)
):
    """Lista todos os produtos, com filtro opcional por preço mínimo"""
    query = db.query(ProdutoDB)
    
    if price_min:
        query = query.filter(ProdutoDB.price >= price_min)
    
    return query.all()

@router.get("/{produto_id}", response_model=ProdutoResponse)
async def obter_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):
    """Obtém um produto específico pelo ID"""
    produto = db.query(ProdutoDB).filter(ProdutoDB.id == produto_id).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto com ID {produto_id} não encontrado"
        )
    
    return produto

@router.put("/{produto_id}", response_model=ProdutoResponse)
async def atualizar_produto(
    produto_id: int,
    produto: ProdutoCreate,
    db: Session = Depends(get_db)
):
    """Atualiza todos os campos de um produto"""
    db_produto = db.query(ProdutoDB).filter(ProdutoDB.id == produto_id).first()
    
    if not db_produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    for field, value in produto.model_dump().items():
        setattr(db_produto, field, value)
    
    db.commit()
    db.refresh(db_produto)
    return db_produto

@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):
    """Remove um produto do banco de dados"""
    produto = db.query(ProdutoDB).filter(ProdutoDB.id == produto_id).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produto com ID {produto_id} não encontrado"
        )
    
    db.delete(produto)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)