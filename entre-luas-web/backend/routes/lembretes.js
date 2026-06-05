const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db/connection');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { apenasFuturos } = req.query;
  let query = 'SELECT * FROM lembretes WHERE usuario_id = ?';
  const params = [req.usuarioId];
  if (apenasFuturos === 'true') {
    query += ' AND data_hora > NOW()';
  }
  query += ' ORDER BY data_hora ASC';
  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { titulo, descricao, data_hora, tipo } = req.body;
  if (!titulo || !data_hora) return res.status(400).json({ error: 'Título e data/hora são obrigatórios' });
  try {
    const [result] = await db.execute(
      `INSERT INTO lembretes (usuario_id, titulo, descricao, data_hora, tipo)
       VALUES (?, ?, ?, ?, ?)`,
      [req.usuarioId, titulo, descricao || null, data_hora, tipo || 'personalizado']
    );
    const [novo] = await db.execute('SELECT * FROM lembretes WHERE id = ?', [result.insertId]);
    res.status(201).json(novo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data_hora, tipo, notificado } = req.body;
  try {
    const [existing] = await db.execute('SELECT id FROM lembretes WHERE id = ? AND usuario_id = ?', [id, req.usuarioId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Lembrete não encontrado' });
    await db.execute(
      `UPDATE lembretes SET titulo = ?, descricao = ?, data_hora = ?, tipo = ?, notificado = ? WHERE id = ?`,
      [titulo, descricao || null, data_hora, tipo || 'personalizado', notificado || false, id]
    );
    const [updated] = await db.execute('SELECT * FROM lembretes WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM lembretes WHERE id = ? AND usuario_id = ?', [id, req.usuarioId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Lembrete não encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/notificar', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE lembretes SET notificado = TRUE WHERE id = ? AND usuario_id = ?', [id, req.usuarioId]);
    res.json({ message: 'Lembrete marcado como notificado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;