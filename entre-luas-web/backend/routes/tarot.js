const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db/connection');
const router = express.Router();

// Listar histórico do usuário
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tarot_historico WHERE usuario_id = ? ORDER BY data_tiragem DESC', [req.usuarioId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Salvar nova tiragem
router.post('/', auth, async (req, res) => {
  const { cartas, interpretacao, contexto } = req.body;
  if (!cartas) return res.status(400).json({ error: 'Cartas são obrigatórias (formato JSON)' });
  try {
    const [result] = await db.execute(
      `INSERT INTO tarot_historico (usuario_id, cartas, interpretacao, contexto)
       VALUES (?, ?, ?, ?)`,
      [req.usuarioId, JSON.stringify(cartas), interpretacao || null, contexto || 'geral']
    );
    const [nova] = await db.execute('SELECT * FROM tarot_historico WHERE id = ?', [result.insertId]);
    res.status(201).json(nova[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Detalhe de uma tiragem
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM tarot_historico WHERE id = ? AND usuario_id = ?', [id, req.usuarioId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Tiragem não encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;