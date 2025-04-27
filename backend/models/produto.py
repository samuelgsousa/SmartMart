from sqlalchemy import Column, Integer, String, Float
from database.connection import Base

class ProdutoDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer)
    brand = Column(String(45))