const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'dados.db');

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

module.exports = db;

const db = require('./db');

function inicializarBanco() {
    const criarTabelaUsuarios = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `;

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

    db.exec(criarTabelaUsuarios);
    db.exec(criarTabelaItens);

    console.log("✅ Banco de dados e tabelas verificados/criados com sucesso!");
}

module.exports = { inicializarBanco };