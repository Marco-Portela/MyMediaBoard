const db = require('./db');

function inicializarBanco() {
    // 1. Criação da Tabela de Usuários
    const criarTabelaUsuarios = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `;

    // 2. Criação da Tabela de Itens (Filmes, Séries, etc)
    const criarTabelaItens = `
        CREATE TABLE IF NOT EXISTS itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            tipo TEXT NOT NULL, 
            genero TEXT,
            status TEXT DEFAULT 'Não iniciado',
            nota INTEGER,
            favorito INTEGER DEFAULT 0, 
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `;

    // Executa as queries
    db.exec(criarTabelaUsuarios);
    db.exec(criarTabelaItens);

    console.log("✅ Banco de dados e tabelas verificados/criados com sucesso!");
}

module.exports = { inicializarBanco };