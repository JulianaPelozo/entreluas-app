import React, { useEffect, useState } from 'react';
import api from '../services/api';

function RodaAno() {
  const [sabbats, setSabbats] = useState([]);
  const [proximo, setProximo] = useState(null);

  useEffect(() => {
    carregarSabbats();
    carregarProximo();
  }, []);

  async function carregarSabbats() {
    try {
      const res = await api.get('/roda-ano?hemisferio=N');
      setSabbats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function carregarProximo() {
    try {
      const res = await api.get('/roda-ano/proximo?hemisferio=N');
      setProximo(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>🌿 Roda do Ano</h2>
      {proximo && (
        <div className="card" style={{ marginBottom: '2rem', background: 'rgba(233, 69, 96, 0.2)' }}>
          <h3>📅 Próximo Sabbat: {proximo.nome_sabbat}</h3>
          <p><strong>Início:</strong> {new Date(proximo.data_inicio).toLocaleDateString('pt-BR')}</p>
          <p>{proximo.descricao}</p>
          <small>Elemento: {proximo.elemento} | Cor: {proximo.cor_associada}</small>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {sabbats.map(s => (
          <div key={s.id} className="card">
            <h3>{s.nome_sabbat}</h3>
            <p><strong>Data:</strong> {new Date(s.data_inicio).toLocaleDateString('pt-BR')}</p>
            <p>{s.descricao}</p>
            <div className="meta">🔥 Elemento: {s.elemento} | 🎨 Cor: {s.cor_associada}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RodaAno;