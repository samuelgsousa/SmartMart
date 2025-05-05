#Notas:

Atualizar requirements: pip freeze > requirements.txt

## No backend:

Ativar ambiente virtual: `.\venv\Scripts\activate`

instalar dependências: `pip install -r requirements.txt`

Iniciar backend: `uvicorn main:app --reload`

NOTA: CRIAR UM SCRIPT PARA CONFIGURAÇÃO DO BANCO DE DADOS

NOTA: Adicionar validação ao adicionar categorias, para evitar duplicações

NOTA: Adicionar botão para baixar linhas que estão com erro, para permitir edição fácil

NOTA: "erro" ao atualizar valor da venda. Casas decimais. 150,00 vira 1,50

Simular delay: await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos


