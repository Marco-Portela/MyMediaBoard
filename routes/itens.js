const express = require('express');
const router = express.Router();
const db = require('../banco/db'); // Conexão com o banco de dados

// =========================================================================
// MIDDLEWARE DE PROTEÇÃO: Garante que só usuários logados entrem aqui
// =========================================================================
function verificarAutenticacao(req, res, next) {
    if (req.session.usuario) {
        return next(); // Tudo certo! Pode prosseguir para a rota.
    }
    res.redirect('/login'); // Não está logado? Vai para o login.
}

// Aplica a proteção em todas as rotas deste arquivo de uma vez só
router.use(verificarAutenticacao);

// =========================================================================
// 1. ROTA PRINCIPAL: Listar itens com Filtros e Ordenação (READ)
// =========================================================================
router.get('/', (req, res) => {
    const usuarioId = req.session.usuario.id;
    
    // Pegando os dados vindos da URL (Ex: ?tipo=Filme&ordenar=titulo)
    const { tipo, status, genero, ordenar } = req.query;

    // Base da Query SQL: busca apenas os itens do usuário logado
    let sql = 'SELECT * FROM itens WHERE usuario_id = ?';
    let params = [usuarioId];

    // Adicionando filtros dinamicamente se o usuário selecionou algum na tela
    if (tipo) {
        sql += ' AND tipo = ?';
        params.push(tipo);
    }
    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    if (genero) {
        sql += ' AND genero = ?';
        params.push(genero);
    }

    // Adicionando a ordenação dinamicamente
    if (ordenar === 'titulo') {
        sql += ' ORDER BY titulo ASC';
    } else {
        // Padrão: ordena por ID decrescente (itens mais recentes primeiro)
        sql += ' ORDER BY id DESC'; 
    }

    try {
        // db.prepare().all() é usado para buscar VÁRIOS registros (uma lista)
        const meusItens = db.prepare(sql).all(...params);
        
        // Renderiza a página passando a lista de itens para o HTML
        res.render('itens/lista', { itens: meusItens, filtros: req.query });
    } catch (error) {
        console.error(error);
        res.send('Erro ao carregar sua coleção.');
    }
});

// =========================================================================
// 2. ROTA DE CADASTRO DE ITEM (CREATE)
// =========================================================================

// Exibe o formulário de inserção
router.get('/novo', (req, res) => {
    res.render('itens/novo');
});

// Processa o envio do formulário de inserção
router.post('/novo', (req, res) => {
    // Desestruturando os dados que o usuário digitou no formulário
    const { titulo, tipo, genero, status, nota, favorito } = req.body;
    const usuarioId = req.session.usuario.id;

    // Tratando o favorito: se veio marcado no checkbox vira 1 (true), se não vira 0 (false)
    const ehFavorito = favorito ? 1 : 0;
    // Se não der nota, vira nulo no banco
    const notaTratada = nota ? parseInt(nota) : null; 

    try {
        const stmt = db.prepare(`
            INSERT INTO itens (usuario_id, titulo, tipo, genero, status, nota, favorito)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        // db.prepare().run() é usado para comandos que alteram dados (INSERT, UPDATE, DELETE)
        stmt.run(usuarioId, titulo, tipo, genero, status, notaTratada, ehFavorito);

        res.redirect('/colecao'); // Redireciona de volta para a lista principal
    } catch (error) {
        console.error(error);
        res.send('Erro ao adicionar o conteúdo.');
    }
});

// =========================================================================
// 3. ROTA DE EDIÇÃO DE ITEM (UPDATE)
// =========================================================================

// Exibe o formulário de edição já preenchido com os dados antigos
router.get('/editar/:id', (req, res) => {
    const { id } = req.params; // Pega o ID da rota (Ex: /Colecao/editar/5)
    const usuarioId = req.session.usuario.id;

    try {
        // Busca o item garantindo que ele pertence ao usuário logado
        const item = db.prepare('SELECT * FROM itens WHERE id = ? AND usuario_id = ?').get(id, usuarioId);

        if (!item) {
            return res.send('Item não encontrado ou você não tem permissão para editá-lo.');
        }

        res.render('itens/editar', { item });
    } catch (error) {
        console.error(error);
        res.send('Erro ao carregar dados para edição.');
    }
});

// Processa as alterações do formulário de edição
router.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, tipo, genero, status, nota, favorito } = req.body;
    const usuarioId = req.session.usuario.id;

    const ehFavorito = favorito ? 1 : 0;
    const notaTratada = nota ? parseInt(nota) : null;

    try {
        const stmt = db.prepare(`
            UPDATE itens 
            SET titulo = ?, tipo = ?, genero = ?, status = ?, nota = ?, favorito = ?
            WHERE id = ? AND usuario_id = ?
        `);
        
        stmt.run(titulo, tipo, genero, status, notaTratada, ehFavorito, id, usuarioId);

        res.redirect('/colecao');
    } catch (error) {
        console.error(error);
        res.send('Erro ao atualizar o conteúdo.');
    }
});

// =========================================================================
// 4. ROTA DE EXCLUSÃO (DELETE)
// =========================================================================
router.post('/deletar/:id', (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.usuario.id;

    try {
        const stmt = db.prepare('DELETE FROM itens WHERE id = ? AND usuario_id = ?');
        stmt.run(id, usuarioId);

        res.redirect('/colecao');
    } catch (error) {
        console.error(error);
        res.send('Erro ao deletar o conteúdo.');
    }
});

module.exports = router;