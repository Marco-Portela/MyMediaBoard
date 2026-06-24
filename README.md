# MyMediaBoard (M²B) 🎬

O **M²B** é uma aplicação web para registrar e organizar o que você já assistiu ou deseja assistir (filmes, séries, animes e animações). O sistema funciona como um gerenciador de tarefas para conteúdos audiovisuais, permitindo classificar e acompanhar seu progresso de forma simples e intuitiva. Projeto desenvolvido como proposta para disciplina acadêmica.

## 🚀 Funcionalidades

- Cadastro e login de usuários.
- Adicionar, editar e remover conteúdos.
- Classificação de status: Não iniciado, Em andamento, Concluído.
- Favoritar e avaliar conteúdos (notas).
- Filtrar por tipo de mídia.
- Ordenação por nome.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML, CSS, JavaScript
- **Back-end:** Node.js (Express)
- **View Engine:** EJS
- **Banco de Dados:** SQLite
- **Deploy:** Railway

## 📂 Estrutura do Projeto

```
MyMediaBoard/
├── servidor.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── banco/
│   ├── dados.db
│   ├── db.js
│   └── queries.js
├── public/
│   ├── css/styles.css
│   └── images/
├── routes/
│   ├── auth.js
│   └── items.js
└── views/
    ├── erro.ejs
    ├── index.ejs
    ├── auth/
    ├── items/
    └── partials/
```

## 🔧 Como Executar Localmente

1. Clone este repositório;
2. Acesse a pasta do projeto: cd MyMediaBoard;
3. Instale as dependências: npm install;
4. Crie um arquivo .env na raiz do projeto configurando suas variáveis (ex: porta do servidor, secret de sessão).
5. Inicie o servidor: npm start;
6. Acesse http://localhost:3000 no seu navegador.
