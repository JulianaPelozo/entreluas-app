const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { obterFaseLua } = require('../services/luaService');
const { obterClima } = require('../services/climaService');
const { gerarRitual } = require('../services/geradorRituais');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM rituais ORDER BY data_criacao DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/gerar-automatico', async (req, res) => {
  const { usuarioId, lat, lon } = req.body;
  try {
    const hoje = new Date().toISOString().slice(0,10);
    const faseLua = await obterFaseLua(hoje);
    const clima = await obterClima(lat, lon);
    const [userRows] = await db.execute('SELECT hemisferio FROM usuarios WHERE id = ?', [usuarioId]);
    const hemisferio = userRows[0].hemisferio;
    const [sabbatRows] = await db.execute(
      'SELECT nome_sabbat FROM roda_ano WHERE hemisferio = ? AND ? BETWEEN data_inicio AND IFNULL(data_fim, data_inicio)',
      [hemisferio, hoje]
    );
    const sabbat = sabbatRows.length ? sabbatRows[0].nome_sabbat : null;
    const novoRitual = await gerarRitual(usuarioId, faseLua.fase, clima, sabbat, hoje);
    res.status(201).json(novoRitual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;