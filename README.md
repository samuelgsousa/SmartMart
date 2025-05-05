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


## 🛠️ Configuração do ambiente (backend)

2. Acesse a pasta `backend` e crie um arquivo `.env` com o seguinte conteúdo:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartmart
DB_USER=root
DB_PASSWORD=0000
```

> Essas variáveis de ambiente são essenciais para a criação e conexão com o banco de dados.

## 🗃️ Inicialização do Banco de Dados

No terminal, navegue até a pasta do backend:

```bash
cd backend
```

Você pode escolher entre as duas opções abaixo para preparar o banco de dados:

### ✅ Opção 1. Automática (Recomendada):

Execute o script de inicialização:

```bash
python init_db.py
```

Esse comando:

- Cria o banco de dados (caso ainda não exista)

- Cria as tabelas automaticamente

- Insere dados iniciais de categorias, produtos e vendas


### ⚙️ Opção 2. Manual:

1. Crie o banco de dados utilizando seu cliente MySQL (CLI, Workbench, phpMyAdmin, etc):

```sql
CREATE DATABASE IF NOT EXISTS smartmart
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

2. Depois, volte ao terminal e execute:

```bash
python init_db.py
```

>Isso criará as tabelas e preencherá os dados iniciais, assumindo que o banco já exista.



## Iniciando o servidor

Depois de concluir as etapas acima, execute:

```bash
uvicorn main:app --reload
```

## Iniciando o Frontend

1. Inicie um novo terminal e acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências (é necessário ter o Node.js instalado):

```bash
npm install
```

3. Inicie a aplicação:

```bash
npm run dev
```

```
http://localhost:5173
```

> Certifique-se de que o backend esteja rodando antes de iniciar o frontend, pois ele consome os dados da API.

## Tecnologias Utilizadas

A aplicação foi construída utilizando as seguintes tecnologias:

### 🧠 Backend

- Python – Linguagem principal para regras de negócio

- FastAPI – Framework web moderno e performático para criação de APIs REST

- SQLAlchemy – ORM para comunicação com banco de dados relacional

- MySQL – Banco de dados relacional utilizado para armazenar os dados

- Uvicorn – Servidor ASGI leve e rápido para executar a aplicação FastAPI

- python-dotenv – Para gerenciamento de variáveis de ambiente

### 📦 Frontend

- React – Biblioteca JavaScript para construção da interface do usuário

- Vite – Ferramenta para desenvolvimento e build do frontend

- TypeScript – Superset do JavaScript que adiciona tipagem estática

- Tailwind CSS – Framework de estilos utilitário para estilização rápida e responsiva

- React Query – Gerenciamento eficiente de requisições e cache de dados

- Shadcn/ui – Componentes de interface modernos e acessíveis baseados em Tailwind

- Lucide Icons – Conjunto de ícones de código aberto e personalizáveis