# Projeto Talker Manager

Esse é um projeto que permite de talkers (palestrantes).

## Objetivo
- Testar meus conhecimentos em express
- Criar um CRUD (Create, Read, Update, Delete) de palestrantes

## Como usar a aplicação 
- Fazer o clone da aplicação 
~~~Java
git clone git@github.com:Leandroswq/talker-manager.git
~~~
- Entrar na pasta do arquivo
~~~Java
cd talker-manager/
~~~
- Instalar as dependencias
~~~Java
npm install
~~~
- Inicializar a aplicação
~~~Java
npm start
~~~

## Endpoints

Obs: Todas as requisições, que precisam de um body, esperam um body no formato JSON

- /login
  - post: Efetua o login
    Necessita de um body no formato JSON contendo emal e passwr]
    Retorna um token de autorização formato
    ~~~JSON
    {
	  "token": "vGk6Fpx4tIinualL"
    }
    ~~~
    O token de retorno deverá se header como Authorization para todas as demais requisições
    
- /talker
  - get: Retorna todos os Talkers cadastrados
  
  - post: Cria um novo talker, as informações do talker devem ser passadas conforme o exemplo abaixo
  ~~~JSON
  {
  "name": "Fulano Silva",
  "age": 56,
  "talk": {
    "watchedAt": "22/10/2019",
    "rate": 5
    }
  }
  ~~~
- /talker/search?q=${suaQueryAqui}
  - get Retorna os dados dos talkers filtrado pelo nome, com base na query
  
- /talker/:id
  - get Retorna os dados do talker que tenha o mesmo id do parametro id
  
  - put Altera os dados do talker que tenha o id igual ao parametro id
    Nescessita de um body no formato
  ~~~JSON
  {
  "name": "Fulano Silva",
  "age": 56,
  "talk": {
    "watchedAt": "22/10/2019",
    "rate": 5
   }
  }
  ~~~
  
  - delete Deleta os dados do talker que tenha o id igual ao parametro id
  
  
  
    
