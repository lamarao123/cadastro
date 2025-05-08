const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MySQL (RAILWAY)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

// Rota para salvar o nome
app.post('/api/save-name', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Nome é obrigatório' });

  const query = 'INSERT INTO users (name) VALUES (?)';
  db.query(query, [name], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao salvar nome' });
    }
    res.json({ message: 'Nome salvo com sucesso!' });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
