const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, senha, data_nascimento, hemisferio, localizacao_padrao } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }
  try {
    const [existing] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    const senhaHash = bcrypt.hashSync(senha, 10);
    const [result] = await db.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, data_nascimento, hemisferio, localizacao_padrao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, senhaHash, data_nascimento || null, hemisferio || 'N', localizacao_padrao || null]
    );
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, usuario: { id: result.insertId, nome, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios' });
  try {
    const [rows] = await db.execute('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
    const usuario = rows[0];
    const senhaValida = bcrypt.compareSync(senha, usuario.senha_hash);
    if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/perfil', require('../middleware/auth'), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nome, email, data_nascimento, hemisferio, localizacao_padrao, created_at FROM usuarios WHERE id = ?', [req.usuarioId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;