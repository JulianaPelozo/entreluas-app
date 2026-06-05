const axios = require('axios');
const db = require('../db/connection');

async function obterFaseLua(data = null) {
    const hoje = new Date().toISOString().slice(0, 10);
    const dataConsulta = data || hoje;

    const [rows] = await db.execute(
        'SELECT fase, iluminacao FROM fases_lua_cache WHERE data = ?', 
        [dataConsulta]
    );
    if (rows.length > 0) {
        return rows[0];
    }

    try {
        const VERVE_API_KEY = process.env.VERVE_API_KEY;
        const url = `https://api.apiverve.com/v1/moonphases?date=${dataConsulta}`;

        const response = await axios.get(url, {
            headers: {
                'X-API-Key': VERVE_API_KEY,
                'Content-Type': 'application/json'
            }
        });

       
        const faseEmIngles = response.data.data.phase; 
        const faseMapeada = mapearFase(faseEmIngles);

        await db.execute(
            'INSERT INTO fases_lua_cache (data, fase, iluminacao) VALUES (?, ?, ?)',
            [dataConsulta, faseMapeada, null]
        );

        return { fase: faseMapeada, iluminacao: null };

    } catch (error) {
        console.error('Erro ao acessar a Moon Phases API:', error.message);
        return { fase: 'Desconhecida', iluminacao: null };
    }
}

function mapearFase(faseEn) {
    const mapa = {
        'New Moon': 'Nova',
        'Waxing Crescent': 'Crescente',
        'First Quarter': 'Quarto Crescente',
        'Waxing Gibbous': 'Crescente Gibosa',
        'Full Moon': 'Cheia',
        'Waning Gibbous': 'Minguante Gibosa',
        'Last Quarter': 'Quarto Minguante',
        'Waning Crescent': 'Minguante'
    };
    return mapa[faseEn] || faseEn;
}

module.exports = { obterFaseLua };