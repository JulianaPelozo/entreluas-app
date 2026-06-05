import React, { useState, useEffect } from 'react';
import api from '../services/api';

const cartasMaiores = [
  "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador",
  "O Hierofante", "Os Enamorados", "A Carruagem", "A Justiça", "O Eremita",
  "Roda da Fortuna", "A Força", "O Enforcado", "A Morte", "A Temperança",
  "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"
];

function Tarot() {
  const [cartas, setCartas] = useState([]);
  const [interpretacao, setInterpretacao] = useState('');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.get('/tarot', { headers: { Authorization: `Bearer ${token}` } });
      setHistorico(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function tirarCartas(qtd = 3) {
    const embaralhadas = [...cartasMaiores];
    for (let i = embaralhadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
    }
    const selecionadas = embaralhadas.slice(0, qtd);
    setCartas(selecionadas);

    let texto = `Você tirou: ${selecionadas.join(', ')}. `;
    if (selecionadas.includes("A Sacerdotisa")) texto += "Ouça sua intuição. ";
    if (selecionadas.includes("O Sol")) texto += "Alegria e sucesso estão a caminho. ";
    if (selecionadas.includes("A Morte")) texto += "Transformação profunda. ";
    if (selecionadas.includes("A Torre")) texto += "Mudanças inesperadas, mas necessárias. ";
    setInterpretacao(texto);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/tarot', {
          cartas: selecionadas,
          interpretacao: texto,
          contexto: 'geral'
        }, { headers: { Authorization: `Bearer ${token}` } });
        carregarHistorico();
      } catch (err) { console.error(err); }
    }
  }

  return (
    <div>
      <h2>Tarot Digital</h2>
      <button onClick={() => tirarCartas(3)}>Tirar 3 cartas</button>

      {cartas.length > 0 && (
        <div className="card" style={{ margin: '1.5rem 0' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            {cartas.map((c, i) => <span key={i}>🃏 {c} &nbsp;</span>)}
          </div>
          <p>{interpretacao}</p>
        </div>
      )}

      <h3>Histórico de tiragens</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {historico.map(h => (
          <div key={h.id} className="card">
            <div><strong>{new Date(h.data_tiragem).toLocaleString('pt-BR')}</strong> – {h.contexto}</div>
            <div>Cartas: {JSON.parse(h.cartas).join(', ')}</div>
            <p className="meta">{h.interpretacao}</p>
          </div>
        ))}
        {historico.length === 0 && <p>Nenhuma tiragem salva ainda.</p>}
      </div>
    </div>
  );
}

export default Tarot;