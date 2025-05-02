from io import BytesIO
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session, relationship, joinedload
from pydantic import BaseModel
from typing import Optional, List
from categories import CategoryDB
from database import SessionLocal, Base
from sqlalchemy import Column, ForeignKey, Integer, String, Float, func
import pandas as pd

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

@router.post("/bulk")
async def bulk_create_products(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Apenas arquivos CSV são permitidos")
    
    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
        
        required_columns = ["name", "price", "category_id", "brand"]
        if not all(col in df.columns for col in required_columns):
            missing = [col for col in required_columns if col not in df.columns]
            raise HTTPException(400, f"Colunas faltando: {', '.join(missing)}")

        products_to_create = []
        errors = []
        
        for index, row in df.iterrows():
            try:
                raw_value = row['category_id']
                category_id = None
                category_name = None
                
                # Etapa 1: Limpeza e análise do valor
                cleaned_value = str(raw_value).strip()
                
                # Etapa 2: Verificação se é numérico válido
                if cleaned_value.isdigit():
                    # Tentar como ID numérico
                    category_id = int(cleaned_value)
                    categoria = db.get(CategoryDB, category_id)
                    
                    if not categoria:
                        raise ValueError(f"Categoria com ID {category_id} não encontrada")
                else:
                    # Tratar como nome
                    category_name = cleaned_value
                    if not category_name:
                        raise ValueError("Nome da categoria não pode ser vazio")
                    
                    # Buscar existente (case-insensitive)
                    categoria = db.query(CategoryDB).filter(
                        func.lower(CategoryDB.name) == category_name.lower()
                    ).first()

                    # Criar nova se necessário
                    if not categoria:
                        categoria = CategoryDB(name=category_name)
                        db.add(categoria)
                        db.flush()

                # Validar e armazenar produto
                product_data = ProdutoCreate(
                    name=row['name'],
                    price=float(row['price']),
                    category_id=categoria.id,
                    brand=row['brand'],
                    description=row.get('description')
                )
                products_to_create.append(product_data.model_dump())

            except Exception as e:
                errors.append({
                    "linha": index + 2,
                    "erro": str(e),
                    "valor_category_id": raw_value,
                    "dados": row.to_dict()
                })
                db.rollback()

        # Commit final
        if products_to_create:
            db.bulk_insert_mappings(ProdutoDB, products_to_create)
            db.commit()

        return {
            "message": f"{len(products_to_create)} produtos criados",
            "erros": errors,
            "total_erros": len(errors)
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Erro geral: {str(e)}")
    
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

