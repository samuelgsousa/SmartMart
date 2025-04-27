from fastapi import FastAPI
from database.connection import Base, engine
from routers.produto import router as produto_router  # Importa o router de produtos

app = FastAPI()

# Registra os routers
app.include_router(produto_router)

@app.get("/")

def home():
    return {"message": "API SmartMart Online"}