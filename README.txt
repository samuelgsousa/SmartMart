#Notas:

Atualizar requirements: pip freeze > requirements.txt

## No backend:

Ativar ambiente virtual: `.\venv\Scripts\activate`

instalar dependências: `pip install -r requirements.txt`

Iniciar backend: `uvicorn main:app --reload`


NOTA: NÃO ESQUECER DE CRIAR A ROTA POST PARA ADICIONAR PRODUTOS POR UM ARQUIVO CSV!!!

NOTA: CRIAR UM SCRIPT PARA CONFIGURAÇÃO DO BANCO DE DADOS

NOTA: Adicionar validação ao adicionar categorias, para evitar duplicações

NOTA: Adicionar botão para baixar linhas que estão com erro, para permitir edição fácil

Simular delay: await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos