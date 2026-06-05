const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { obterFaseLua } = require('../services/luaService');

// Buscar fase da lua para uma data específica (ou hoje)
router.get('/', async (req, res) => {
  let data = req.query.data || new Date().toISOString().slice(0,10);
  try {
    const fase = await obterFaseLua(data);
    res.json({ data, ...fase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar cache das fases (últimos 30 dias)
router.get('/cache', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM fases_lua_cache ORDER BY data DESC LIMIT 30');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;