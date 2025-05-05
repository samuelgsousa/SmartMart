from altair import Column
from sqlalchemy import Column, Integer, String, ForeignKey,  Date, Float
from sqlalchemy.orm import relationship
from database import Base

class CategoryDB(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45))
    produto = relationship("ProdutoDB", back_populates="category")

class ProdutoDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    brand = Column(String(45))
    sales = relationship(
        "SaleDB", 
        back_populates="produto",
        cascade="all, delete",  
        passive_deletes=True    
    )

    category = relationship("CategoryDB", back_populates="produto")

class SaleDB(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete='CASCADE'))
    quantity = Column(Integer)
    total_price = Column(Float)
    date = Column(Date)
    produto = relationship("ProdutoDB", back_populates="sales")
