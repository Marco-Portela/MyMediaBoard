const Database = require('better-sqlite3');
const path = require('path');

// Aponta para o arquivo dados.db na mesma pasta
const dbPath = path.join(__dirname, 'dados.db');

// Cria a conexão (o arquivo será criado automaticamente se não existir)
const db = new Database(dbPath);

// Habilita o uso de chaves estrangeiras (Foreign Keys) no SQLite
db.pragma('foreign_keys = ON');

module.exports = db;

