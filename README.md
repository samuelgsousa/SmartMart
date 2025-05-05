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

## 🛠️ Configuração do Banco de Dados
Antes de iniciar a aplicação, certifique-se de configurar corretamente as variáveis de ambiente no arquivo .env, localizado na raiz da pasta backend.

Crie um arquivo .env com o seguinte conteúdo:

```ini
DB_HOST=seu_host_remoto_ou_localhost
DB_PORT=3306
DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASSWORD=senha
```

Exemplo de ambiente local:
```ini
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartmart
DB_USER=root
DB_PASSWORD=5246
```


## Executando o Frontend

Siga os passos abaixo para rodar o frontend da aplicação:

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