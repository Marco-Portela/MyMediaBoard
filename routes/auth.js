const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../banco/db'); // Importa a conexão com o banco

// ==========================================
// 1. ROTAS DE CADASTRO
// ==========================================

// Exibe a página de Cadastro
router.get('/cadastro', (req, res) => {
    res.render('auth/cadastro');
});

// Processa o formulário de Cadastro
router.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // CORREÇÃO: Verifica se a senha atende ao requisito mínimo no servidor
        if (!senha || senha.length < 6) {
            return res.send('Erro: A senha deve conter pelo menos 6 caracteres.');
        }

        // Verifica se o e-mail já está cadastrado
        const usuarioExiste = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
        if (usuarioExiste) {
            return res.send('Este e-mail já está cadastrado.');
        }

        // Criptografa a senha antes de salvar no banco
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Insere o novo usuário no banco de dados
        const stmt = db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
        stmt.run(nome, email, senhaCriptografada);

        // Cadastro feito com sucesso! Redireciona para o login
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.send('Erro ao realizar o cadastro.');
    }
});

// ==========================================
// 2. ROTAS DE LOGIN
// ==========================================

// Exibe a página de Login
router.get('/login', (req, res) => {
    res.render('auth/login');
    });

// Processa o formulário de Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo e-mail
        const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
        
        if (!usuario) {
            return res.send('Usuário ou senha incorretos.');
        }

        // Compara a senha digitada com a senha criptografada do banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.send('Usuário ou senha incorretos.');
        }

        // Se deu tudo certo, salva o usuário na Sessão (ele agora está logado!)
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        // Redireciona para a página principal ou para a coleção
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send('Erro ao tentar fazer login.');
    }
});

// ==========================================
// 3. ROTA DE LOGOUT (SAIR)
// ==========================================
router.get('/sair', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;