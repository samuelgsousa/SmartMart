import os
from datetime import date
from sqlalchemy.exc import ProgrammingError, IntegrityError
from sqlalchemy import create_engine, text
from database import Base, SessionLocal
from models import CategoryDB, ProdutoDB, SaleDB


def main():
    db_url_full = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    db_url_root = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}"

    # 1) Conecta sem o database para criá-lo
    root_engine = create_engine(db_url_root, isolation_level="AUTOCOMMIT")
    with root_engine.connect() as conn:
        conn.execute(
            text(
                "CREATE DATABASE IF NOT EXISTS smartmart "
                "CHARACTER SET utf8mb4 "
                "COLLATE utf8mb4_unicode_ci"
            )
        )
        print("✅ Database `smartmart` criado ou já existente.")

    # 2 Cria as tabelas (estrutura) se ainda não existirem
    
    app_engine = create_engine(db_url_full)
    print("🔄 Criando as tabelas no banco de dados...")
    Base.metadata.create_all(bind=app_engine)
    print("✅ Tabelas criadas com sucesso.")

    db = SessionLocal()

    # Redefine SessionLocal para usar app_engine:
    SessionLocal.configure(bind=app_engine)
    try:

        categorias = [
            CategoryDB(id=1, name='TVs'),
            CategoryDB(id=2, name='Refrigerators'),
            CategoryDB(id=3, name='Laptops'),
            CategoryDB(id=4, name='Microwaves'),
            CategoryDB(id=5, name='Smartphones'),
        ]


        db.add_all(categorias)
        db.commit()
        print("✅ Categorias inseridas.")
        
        # 3) Insere produtos
        produtos = [
            ProdutoDB(id=1, name='Samsung 65" QLED TV', description='65-inch 4K Smart TV with HDR and quantum dot technology', price=129999, category_id=1, brand='Samsung'),
            ProdutoDB(id=2, name='LG OLED55C1', description='55-inch OLED 4K Smart TV with AI ThinQ and G-Sync compatibility', price=149999, category_id=1, brand='LG'),
            ProdutoDB(id=3, name='Sony Bravia XR', description='65-inch 8K LED Smart TV with cognitive processor XR', price=189999, category_id=1, brand='Sony'),
            ProdutoDB(id=4, name='LG French Door Refrigerator', description='26.2 cu. ft. smart refrigerator with ice maker and door-in-door', price=219999, category_id=2, brand='LG'),
            ProdutoDB(id=5, name='Samsung Family Hub', description='27 cu. ft. smart refrigerator with touchscreen and cameras', price=279999, category_id=2, brand='Samsung'),
            ProdutoDB(id=6, name='Whirlpool Side-by-Side', description='25 cu. ft. fingerprint resistant stainless steel refrigerator', price=149999, category_id=2, brand='Whirlpool'),
            ProdutoDB(id=7, name='Dell XPS 15', description='15.6-inch touchscreen laptop with Intel i9 and 32GB RAM', price=199999, category_id=3, brand='Dell'),
            ProdutoDB(id=8, name='MacBook Pro 16', description='16-inch laptop with M1 Pro chip and 16GB unified memory', price=249999, category_id=3, brand='Apple'),
            ProdutoDB(id=9, name='Lenovo ThinkPad X1', description='14-inch business laptop with Intel i7 and 16GB RAM', price=169999, category_id=3, brand='Lenovo'),
            ProdutoDB(id=10, name='Panasonic Countertop Microwave', description='1.3 cu. ft. 1100W microwave with inverter technology', price=17999, category_id=4, brand='Panasonic'),
            ProdutoDB(id=11, name='GE Profile Smart Microwave', description='1.7 cu. ft. convection microwave with scan-to-cook technology', price=34999, category_id=4, brand='GE'),
            ProdutoDB(id=12, name='Samsung Countertop Microwave', description='1.1 cu. ft. microwave with sensor cooking', price=15999, category_id=4, brand='Samsung'),
            ProdutoDB(id=13, name='iPhone 13 Pro Max', description='6.7-inch Super Retina XDR display with ProMotion and A15 Bionic chip', price=109999, category_id=5, brand='Apple'),
            ProdutoDB(id=14, name='Samsung Galaxy S22 Ultra', description='6.8-inch Dynamic AMOLED 2X with S Pen and 108MP camera', price=119999, category_id=5, brand='Samsung'),
            ProdutoDB(id=15, name='Google Pixel 6 Pro', description='6.7-inch LTPO OLED with Google Tensor processor and 50MP camera', price=89999, category_id=5, brand='Google'),
        ]

        db.add_all(produtos)
        db.commit()
        print("✅ Produtos inseridos.")

         # 4) Insere vendas

        sales = [
    SaleDB(id=1, product_id=1, quantity=12, total_price=1559988, date=date(2025, 1, 15)),
    SaleDB(id=2, product_id=1, quantity=8,  total_price=1039992, date=date(2025, 3, 22)),
    SaleDB(id=3, product_id=1, quantity=15, total_price=1949985, date=date(2025, 7,  5)),
    SaleDB(id=4, product_id=1, quantity=10, total_price=1299990, date=date(2025, 10, 18)),
    SaleDB(id=5, product_id=2, quantity=6,  total_price= 899994, date=date(2025, 2, 12)),
    SaleDB(id=6, product_id=2, quantity=11, total_price=1649989, date=date(2025, 5, 30)),
    SaleDB(id=7, product_id=2, quantity=9,  total_price=1349991, date=date(2025, 9, 14)),
    SaleDB(id=8, product_id=2, quantity=7,  total_price=1049993, date=date(2025, 12, 1)),
    SaleDB(id=9, product_id=3, quantity=5,  total_price= 949995, date=date(2025, 1, 28)),
    SaleDB(id=10,product_id=3, quantity=8,  total_price=1519992, date=date(2025, 4, 10)),
    SaleDB(id=11,product_id=3, quantity=3,  total_price= 569997, date=date(2025, 8, 23)),
    SaleDB(id=12,product_id=3, quantity=6,  total_price=1139994, date=date(2025, 11, 15)),
    SaleDB(id=13,product_id=4, quantity=4,  total_price= 879996, date=date(2025, 2,  5)),
    SaleDB(id=14,product_id=4, quantity=7,  total_price=1539993, date=date(2025, 6, 18)),
    SaleDB(id=15,product_id=4, quantity=3,  total_price= 659997, date=date(2025, 9, 27)),
    SaleDB(id=16,product_id=4, quantity=5,  total_price=1099995, date=date(2025, 12,10)),
    SaleDB(id=17,product_id=5, quantity=3,  total_price= 839997, date=date(2025, 3,  8)),
    SaleDB(id=18,product_id=5, quantity=6,  total_price=1679994, date=date(2025, 5, 22)),
    SaleDB(id=19,product_id=5, quantity=2,  total_price= 559998, date=date(2025, 8, 15)),
    SaleDB(id=20,product_id=5, quantity=4,  total_price=1119996, date=date(2025, 11,30)),
    SaleDB(id=21,product_id=6, quantity=8,  total_price=1199992, date=date(2025, 1, 20)),
    SaleDB(id=22, product_id=6,  quantity=5,  total_price= 749995, date=date(2025,  4, 15)),
    SaleDB(id=23, product_id=6,  quantity=10, total_price=1499990, date=date(2025,  7, 27)),
    SaleDB(id=24, product_id=6,  quantity=6,  total_price= 899994, date=date(2025, 10,  5)),
    SaleDB(id=25, product_id=7,  quantity=15, total_price=2999985, date=date(2025,  2, 18)),
    SaleDB(id=26, product_id=7,  quantity=8,  total_price=1599992, date=date(2025,  5, 12)),
    SaleDB(id=27, product_id=7,  quantity=12, total_price=2399988, date=date(2025,  9,  3)),
    SaleDB(id=28, product_id=7,  quantity=10, total_price=1999990, date=date(2025, 12, 15)),
    SaleDB(id=29, product_id=8,  quantity=6,  total_price=1499994, date=date(2025,  3,  1)),
    SaleDB(id=30, product_id=8,  quantity=9,  total_price=2249991, date=date(2025,  6, 25)),
    SaleDB(id=31, product_id=8,  quantity=4,  total_price= 999996, date=date(2025, 10, 12)),
    SaleDB(id=32, product_id=8,  quantity=7,  total_price=1749993, date=date(2025, 12, 28)),
    SaleDB(id=33, product_id=9,  quantity=10, total_price=1699990, date=date(2025,  1, 10)),
    SaleDB(id=34, product_id=9,  quantity=12, total_price=2039988, date=date(2025,  4, 22)),
    SaleDB(id=35, product_id=9,  quantity=8,  total_price=1359992, date=date(2025,  8,  9)),
    SaleDB(id=36, product_id=9,  quantity=5,  total_price= 849995, date=date(2025, 11,  5)),
    SaleDB(id=37, product_id=10, quantity=20, total_price= 359980, date=date(2025,  2, 28)),
    SaleDB(id=38, product_id=10, quantity=15, total_price= 269985, date=date(2025,  5, 17)),
    SaleDB(id=39, product_id=10, quantity=25, total_price= 449975, date=date(2025,  9, 20)),
    SaleDB(id=40, product_id=10, quantity=18, total_price= 323982, date=date(2025, 12,  3)),
    SaleDB(id=41, product_id=11, quantity=8,  total_price= 279992, date=date(2025,  1, 25)),
    SaleDB(id=42, product_id=11, quantity=12, total_price= 419988, date=date(2025,  4, 30)),
    SaleDB(id=43, product_id=11, quantity=6,  total_price= 209994, date=date(2025,  7, 15)),
    SaleDB(id=44, product_id=11, quantity=10, total_price= 349990, date=date(2025, 10, 28)),
    SaleDB(id=45, product_id=12, quantity=15, total_price= 239985, date=date(2025,  3, 15)),
    SaleDB(id=46, product_id=12, quantity=22, total_price= 351978, date=date(2025,  6, 10)),
    SaleDB(id=47, product_id=12, quantity=13, total_price= 207987, date=date(2025,  9,  8)),
    SaleDB(id=48, product_id=12, quantity=18, total_price= 287982, date=date(2025, 11, 22)),
    SaleDB(id=49, product_id=13, quantity=25, total_price=2749975, date=date(2025,  2,  8)),
    SaleDB(id=50, product_id=13, quantity=30, total_price=3299970, date=date(2025,  5, 25)),
    SaleDB(id=51, product_id=13, quantity=18, total_price=1979982, date=date(2025,  8, 30)),
    SaleDB(id=52, product_id=13, quantity=22, total_price=2419978, date=date(2025, 12, 20)),
    SaleDB(id=53, product_id=14, quantity=12, total_price=1439988, date=date(2025,  1,  5)),
    SaleDB(id=54, product_id=14, quantity=15, total_price=1799985, date=date(2025,  4, 18)),
    SaleDB(id=55, product_id=14, quantity=10, total_price=1199990, date=date(2025,  7, 22)),
    SaleDB(id=56, product_id=14, quantity=8,  total_price= 959992, date=date(2025, 10, 15)),
    SaleDB(id=57, product_id=15, quantity=20, total_price=1799980, date=date(2025,  3, 10)),
    SaleDB(id=58, product_id=15, quantity=15, total_price=1349985, date=date(2025,  6, 22)),
    SaleDB(id=59, product_id=15, quantity=25, total_price=2249975, date=date(2025,  9, 15)),
    SaleDB(id=60, product_id=15, quantity=18, total_price=1619982, date=date(2025, 12,  5)),
]

        db.add_all(sales)
        db.commit()
        print("✅ Vendas inseridas.")

    except IntegrityError:
        db.rollback()
        print("⚠️ Alguns registros já existiam. A inserção foi ignorada onde havia duplicata.")
    finally:
        db.close()

if __name__ == "__main__":
    main()