# Painel Smart Mart

Aplicação web desenvolvida para oferecer uma base sólida de visualização e gestão de dados de vendas. Permite o cadastro manual ou em lote de produtos, bem como a análise de desempenho por meio de gráficos interativos.

<br>

## Funcionalidades

- **Dashboard de vendas**: gráficos com visualização da quantidade de vendas mensais, lucro mensal e vendas por categoria.

- **Gestão de dados**: visualização, adição, edição e exclusão de produtos, categorias e registros de venda.

- **Importação via CSV**: adição de produtos em lote por meio de arquivos `.csv`.

- **Filtros por categoria**: permite filtrar produtos com base na categoria selecionada.

## Instalação:

1. Clone o repositório:

`git clone https://github.com/samuelgsousa/SmartMart`

2. Acesse a pasta **backend**, 

```bash
cd SmartMart/backend
```

3. crie um ambiente virtual e instale as dependências:

Para Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Para Linux/Mac:

```bash
python3 -m venv venv
source venv/bin/activate
```

4. Instale as dependências

```bash
pip install -r requirements.txt
```

5. Inicie o servidor

```bash
uvicorn main:app --reload
```



