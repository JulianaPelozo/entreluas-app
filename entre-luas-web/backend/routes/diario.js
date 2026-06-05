const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db/connection');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { ano, mes } = req.query;
  let query = 'SELECT * FROM diario WHERE usuario_id = ?';
  const params = [req.usuarioId];
  if (ano && mes) {
    query += ' AND YEAR(data_criacao) = ? AND MONTH(data_criacao) = ?';
    params.push(ano, mes);
  }
  query += ' ORDER BY data_criacao DESC';
  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { titulo, conteudo, humor, fase_lua_dia, sabbat_dia, sentimentos } = req.body;
  if (!conteudo) return res.status(400).json({ error: 'Conteúdo é obrigatório' });
  try {
    const [result] = await db.execute(
      `INSERT INTO diario (usuario_id, titulo, conteudo, humor, fase_lua_dia, sabbat_dia, sentimentos)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.usuarioId, titulo || null, conteudo, humor || null, fase_lua_dia || null, sabbat_dia || null, sentimentos || null]
    );
    const [nova] = await db.execute('SELECT * FROM diario WHERE id = ?', [result.insertId]);
    res.status(201).json(nova[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo, humor, sentimentos } = req.body;
  try {
    const [existing] = await db.execute('SELECT id FROM diario WHERE id = ? AND usuario_id = ?', [id, req.usuarioId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Entrada não encontrada' });
    await db.execute(
      `UPDATE diario SET titulo = ?, conteudo = ?, humor = ?, sentimentos = ? WHERE id = ?`,
      [titulo || null, conteudo, humor || null, sentimentos || null, id]
    );
    const [updated] = await db.execute('SELECT * FROM diario WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM diario WHERE id = ? AND usuario_id = ?', [id, req.usuarioId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Entrada não encontrada' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;