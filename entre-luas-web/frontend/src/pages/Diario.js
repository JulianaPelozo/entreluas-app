import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Diario() {
  const [entradas, setEntradas] = useState([]);
  const [novaEntrada, setNovaEntrada] = useState({ titulo: '', conteudo: '', humor: '' });

  useEffect(() => {
    carregarEntradas();
  }, []);

  async function carregarEntradas() {
    try {
      const res = await api.get('/diario', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEntradas(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function criarEntrada() {
    if (!novaEntrada.conteudo) return alert('Conteúdo obrigatório');
    try {
      await api.post('/diario', novaEntrada, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNovaEntrada({ titulo: '', conteudo: '', humor: '' });
      carregarEntradas();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <h1>📓 Diário Espiritual</h1>
      <div style={{ marginBottom: '2rem', background: '#0f3460', padding: '1rem', borderRadius: '8px' }}>
        <h3>Nova entrada</h3>
        <input
          type="text"
          placeholder="Título"
          value={novaEntrada.titulo}
          onChange={e => setNovaEntrada({ ...novaEntrada, titulo: e.target.value })}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <textarea
          placeholder="Conteúdo"
          value={novaEntrada.conteudo}
          onChange={e => setNovaEntrada({ ...novaEntrada, conteudo: e.target.value })}
          rows="4"
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Humor (ex: feliz, calmo)"
          value={novaEntrada.humor}
          onChange={e => setNovaEntrada({ ...novaEntrada, humor: e.target.value })}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <button onClick={criarEntrada}>Salvar</button>
      </div>
      <h2>Entradas anteriores</h2>
      {entradas.map(e => (
        <div key={e.id} style={{ borderBottom: '1px solid #e94560', marginBottom: '1rem' }}>
          <h3>{e.titulo || 'Sem título'}</h3>
          <p>{e.conteudo}</p>
          <small>{new Date(e.data_criacao).toLocaleString('pt-BR')} - Humor: {e.humor || '-'}</small>
        </div>
      ))}
    </div>
  );
}

export default Diario;