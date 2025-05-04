from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, relationship
from pydantic import BaseModel
from typing import List
from database import SessionLocal, Base, engine
from sqlalchemy import Column, Integer, String

# --- Modelo SQLAlchemy ---
class CategoryDB(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45))
    produto = relationship("ProdutoDB", back_populates="category")

# --- Schemas Pydantic ---
class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(CategoryCreate):
    id: int
    class Config:
        from_attributes = True

class ConflictResponse(BaseModel):
    detail: str
    required_action: str
    related_products_count: int

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

@router.put("/{category_id}", response_model=CategoryResponse)
async def atualizar_categoria(
    category_id: int,
    categoria: CategoryCreate
):
    db = SessionLocal()
    
    # Busca a categoria no banco
    db_categoria = db.query(CategoryDB).filter(CategoryDB.id == category_id).first()

    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    db_categoria.name = categoria.name #Atualiza o nome

    db.commit()
    db.refresh(db_categoria)
    db.close()
    
    return db_categoria

@router.delete("/{category_id}", responses={
    200: {"description": "Categoria excluída com sucesso"},
    404: {"description": "Categoria não encontrada"},
    409: {"description": "Conflito com produtos existentes", "model": ConflictResponse}
})
async def excluir_categoria(category_id: int, delete_params: str = Query(None)):

    db = SessionLocal()

    # Busca a categoria no banco de dados

    db_categoria = db.query(CategoryDB).filter(CategoryDB.id == category_id).first()

    if not category_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria com ID {category_id} não encontrada"
        )
 

    
    # Obter todos os produtos vinculados
    produtos_vinculados = db_categoria.produto
    
    additional_msg = "Nenhum produto vinculado"


    if produtos_vinculados:
        if delete_params == "force_delete": #Deleta todos os produtos vinculados a essa categoria
            for produto in produtos_vinculados:
                db.delete(produto)
            db.commit()
            additional_msg = f"{len(produtos_vinculados)} produtos foram excluídos"

        elif delete_params == "reassign": #Altera a categoria de todos os produtos para "Outros"

            categoria_outros = db.query(CategoryDB).filter(CategoryDB.name == "Outros").first()

            if not categoria_outros: # Caso "Outros" não exista, cria e vincula
                categoria_outros = CategoryDB(name="Outros")
                db.add(categoria_outros)
                db.commit()
                db.refresh(categoria_outros)

            # Atualiza todos os produtos vinculados
            for produto in produtos_vinculados:
                produto.category_id = categoria_outros.id
            db.commit()

            additional_msg = f"{len(produtos_vinculados)} produtos tiveram suas categorias alteradas para Outros"

        elif delete_params == "void" or not delete_params: #Caso existam produtos vinculados, mas não tenha sido passado parâmetros para deletar, retorna um erro
            raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "Existem produtos vinculados a esta categoria, por favor, passe um parâmetro de exclusão",
                "products": [
                    {
                        "id": produto.id,
                        "name": produto.name,
                        "category_id": produto.category_id
                    } for produto in produtos_vinculados
                ],
                "products_count": len(produtos_vinculados)
            })

    # Remove a categoria
    db.delete(db_categoria)
    db.commit()
    db.close()
    
    return {"mensagem": f"Categoria com ID {category_id} excluída com sucesso. {additional_msg}"}