require('dotenv').config()

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const PORTA = process.env.PORT || 3000;
const { inicializarBanco } = require('./banco/queries');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* 6. Rota GET de Teste (Antes de criarmos o HTML de verdade)
app.get('/', (req, res) => {
    res.send('Olá, seja Bem-vindo ao MyMediaBoard.');
}); */

app.use(session({
    secret: process.env.SESSION_SECRET || 'zaqwsxcderfvbgtyhnmjupoiuyhjklç',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.locals.usuarioLogado = req.session.usuario || null;
    next();
});

const authRoutes = require('./routes/auth');
const itensRoutes = require('./routes/itens');

app.use('/', authRoutes);
app.use('/colecao', itensRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.use((req, res) => {
    res.status(404).render('404');
});

inicializarBanco();

app.listen(PORTA, () => {
    console.log(`Servidor rodando perfeitamente em: http://localhost:${PORTA}`);
});