const db = require('../db/connection');

async function gerarRitual(usuarioId, faseLua, clima, sabbat, dataAtual) {
  const [result] = await db.execute('CALL gerar_ritual_automatico(?, ?, ?, ?)', 
    [usuarioId, faseLua, clima, dataAtual]);
  const ritualId = result[0][0].id_ritual_gerado;
  const [ritual] = await db.execute('SELECT * FROM rituais WHERE id = ?', [ritualId]);
  return ritual[0];
}

async function gerarRitualPorTarot(usuarioId, cartaTarot, faseLua, clima) {
  let titulo = '';
  let descricao = '';
  if (cartaTarot === 'A Sacerdotisa' && faseLua === 'Cheia') {
    titulo = 'Portal da Intuição';
    descricao = 'Sente-se ao luar com a carta da Sacerdotisa, acenda um incenso de jasmim e escreva seus sonhos.';
  } else {
    titulo = 'Ritual de Conexão com o Tarot';
    descricao = 'Medite com a carta sorteada, observe suas cores e símbolos. Faça uma oferenda de flor branca.';
  }
  const [insertResult] = await db.execute(
    'INSERT INTO rituais (titulo, descricao, fase_lua_sugerida, clima_sugerido, e_gerado) VALUES (?, ?, ?, ?, ?)',
    [titulo, descricao, faseLua, clima, true]
  );
  const [novoRitual] = await db.execute('SELECT * FROM rituais WHERE id = ?', [insertResult.insertId]);
  return novoRitual[0];
}

module.exports = { gerarRitual, gerarRitualPorTarot };