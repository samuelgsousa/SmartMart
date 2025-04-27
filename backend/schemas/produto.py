from pydantic import BaseModel, Field
from typing import Optional

class ProdutoBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category_id: int
    brand: str = Field(..., max_length=45)

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel): 
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    brand: Optional[str] = None

class ProdutoResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category_id: int
    brand: str

    class Config:
        from_attributes = True 