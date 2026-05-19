// 1. Importando as ferramentas necessárias
const express = require('express');
const app = express();

// 2. Definindo a porta do servidor
const PORTA = process.env.PORT || 3000;

// 3. Configurações do EJS (Nosso "chef de cozinha")
app.set('view engine', 'ejs');

// 4. Configurando a pasta 'public' para CSS e Imagens
app.use(express.static('public'));

// 5. Permite que o servidor entenda dados enviados por formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 6. Rota GET de Teste (Antes de criarmos o HTML de verdade)
app.get('/', (req, res) => {
    res.send('Olá, seja Bem-vindo ao MyMediaBoard.');
});

// 7. Ligando o servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando perfeitamente em: http://localhost:${PORTA}`);
});