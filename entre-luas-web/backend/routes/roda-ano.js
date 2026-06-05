const express = require('express');
const db = require('../db/connection');
const router = express.Router();

router.get('/', async (req, res) => {
  const hemisferio = req.query.hemisferio || 'N';
  try {
    const [rows] = await db.execute('SELECT * FROM roda_ano WHERE hemisferio = ? ORDER BY data_inicio', [hemisferio]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/proximo', async (req, res) => {
  const hemisferio = req.query.hemisferio || 'N';
  const hoje = new Date().toISOString().slice(0,10);
  try {
    const [rows] = await db.execute(
      `SELECT * FROM roda_ano 
       WHERE hemisferio = ? AND data_inicio >= ?
       ORDER BY data_inicio LIMIT 1`,
      [hemisferio, hoje]
    );
    if (rows.length === 0) return res.json({ message: 'Nenhum Sabbat futuro encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;