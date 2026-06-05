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
    <div className="container">
      <h1>🌿 Roda do Ano</h1>
      {proximo && (
        <div style={{ background: '#0f3460', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h3>📅 Próximo Sabbat: {proximo.nome_sabbat}</h3>
          <p>Início: {new Date(proximo.data_inicio).toLocaleDateString('pt-BR')}</p>
          <p>{proximo.descricao}</p>
        </div>
      )}
      <h2>Todos os Sabbats</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {sabbats.map(s => (
          <div key={s.id} style={{ border: '1px solid #e94560', padding: '1rem', borderRadius: '8px' }}>
            <h3>{s.nome_sabbat}</h3>
            <p><strong>Data:</strong> {new Date(s.data_inicio).toLocaleDateString('pt-BR')}</p>
            <p>{s.descricao}</p>
            <small>Elemento: {s.elemento} | Cor: {s.cor_associada}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RodaAno;