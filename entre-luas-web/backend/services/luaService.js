const axios = require('axios');
const db = require('../db/connection');

async function obterFaseLua(data) {
  const [rows] = await db.execute('SELECT fase, iluminacao FROM fases_lua_cache WHERE data = ?', [data]);
  if (rows.length > 0) {
    return rows[0];
  }

  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/astronomy.json`, {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: '-23.5505,-46.6333', 
        dt: data
      }
    });
    const moonPhase = response.data.astronomy.astro.moon_phase; 
    const faseMapeada = mapearFase(moonPhase);
    await db.execute('INSERT INTO fases_lua_cache (data, fase, iluminacao) VALUES (?, ?, ?)', 
      [data, faseMapeada, null]);
    return { fase: faseMapeada, iluminacao: null };
  } catch (error) {
    console.error('Erro ao obter fase lunar', error);
    return { fase: 'Desconhecida', iluminacao: null };
  }
}

function mapearFase(phaseEn) {
  const mapa = {
    'New Moon': 'Nova',
    'Waxing Crescent': 'Crescente',
    'First Quarter': 'Crescente Gibosa',
    'Waxing Gibbous': 'Crescente Gibosa',
    'Full Moon': 'Cheia',
    'Waning Gibbous': 'Minguante Gibosa',
    'Last Quarter': 'Minguante',
    'Waning Crescent': 'Minguante'
  };
  return mapa[phaseEn] || phaseEn;
}

module.exports = { obterFaseLua };