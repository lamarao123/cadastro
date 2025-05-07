// server.js - Exemplo de API RESTful usando Node.js e Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite requisições de diferentes origens (CORS)
app.use(bodyParser.json()); // Para parsing de application/json

// Simulação de banco de dados com um array
let users = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 98765-4321',
    age: 28,
    gender: 'Masculino',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@exemplo.com',
    phone: '(21) 99876-5432',
    age: 35,
    gender: 'Feminino',
    address: 'Rua Copacabana, 500 - Rio de Janeiro, RJ'
  }
];

// Rotas da API

// Listar todos os usuários
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Obter um usuário específico por ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(user => user.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  
  res.json(user);
});

// Criar um novo usuário
app.post('/api/users', (req, res) => {
  // Verificar se o email já existe
  const emailExists = users.some(user => user.email === req.body.email);
  
  if (emailExists) {
    return res.status(400).json({ message: 'Este email já está cadastrado' });
  }
  
  const newUser = {
    id: Date.now().toString(), // Usando timestamp como ID
    ...req.body
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Atualizar um usuário existente
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(user => user.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  
  // Verificar se o email já existe (exceto para o próprio usuário)
  const emailExists = users.some(user => 
    user.email === req.body.email && user.id !== req.params.id
  );
  
  if (emailExists) {
    return res.status(400).json({ message: 'Este email já está sendo usado por outro usuário' });
  }
  
  // Atualizar o usuário mantendo o ID original
  users[index] = {
    ...req.body,
    id: req.params.id
  };
  
  res.json(users[index]);
});

// Excluir um usuário
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(user => user.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  
  users.splice(index, 1);
  res.json({ message: 'Usuário excluído com sucesso' });
});

// Buscar usuários (por nome, email, telefone ou endereço)
app.get('/api/users/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  
  if (!query) {
    return res.json(users);
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.phone.includes(query) ||
    user.address.toLowerCase().includes(query)
  );
  
  res.json(filteredUsers);
});

// Corrigindo a rota de busca (deve vir depois da rota de ID para não conflitar)
app.get('/api/users/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  
  if (!query) {
    return res.json(users);
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.phone.includes(query) ||
    user.address.toLowerCase().includes(query)
  );
  
  res.json(filteredUsers);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});