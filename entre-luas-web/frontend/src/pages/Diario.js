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
      const token = localStorage.getItem('token');
      const res = await api.get('/diario', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntradas(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function criarEntrada() {
    if (!novaEntrada.conteudo) return alert('Conteúdo obrigatório');
    try {
      const token = localStorage.getItem('token');
      await api.post('/diario', novaEntrada, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNovaEntrada({ titulo: '', conteudo: '', humor: '' });
      carregarEntradas();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>📓 Diário Espiritual</h2>
      {/* Formulário em card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
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

      <h3>Entradas anteriores</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entradas.map(e => (
          <div key={e.id} className="card">
            <h3>{e.titulo || 'Sem título'}</h3>
            <p>{e.conteudo}</p>
            <div className="meta">
              {new Date(e.data_criacao).toLocaleString('pt-BR')} – Humor: {e.humor || '-'}
            </div>
          </div>
        ))}
        {entradas.length === 0 && <p>Nenhuma entrada ainda. Escreva algo!</p>}
      </div>
    </div>
  );
}

export default Diario;