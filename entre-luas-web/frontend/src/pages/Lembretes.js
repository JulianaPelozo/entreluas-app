import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Lembretes() {
  const [lembretes, setLembretes] = useState([]);
  const [novoLembrete, setNovoLembrete] = useState({
    titulo: '',
    descricao: '',
    data_hora: '',
    tipo: 'personalizado'
  });

  useEffect(() => {
    carregarLembretes();
  }, []);

  async function carregarLembretes() {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/lembretes?apenasFuturos=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLembretes(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function criarLembrete() {
    if (!novoLembrete.titulo || !novoLembrete.data_hora) {
      return alert('Título e data/hora são obrigatórios');
    }
    try {
      const token = localStorage.getItem('token');
      await api.post('/lembretes', novoLembrete, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNovoLembrete({ titulo: '', descricao: '', data_hora: '', tipo: 'personalizado' });
      carregarLembretes();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>⏰ Lembretes</h2>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Novo lembrete</h3>
        <input
          type="text"
          placeholder="Título"
          value={novoLembrete.titulo}
          onChange={e => setNovoLembrete({ ...novoLembrete, titulo: e.target.value })}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <textarea
          placeholder="Descrição"
          value={novoLembrete.descricao}
          onChange={e => setNovoLembrete({ ...novoLembrete, descricao: e.target.value })}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="datetime-local"
          value={novoLembrete.data_hora}
          onChange={e => setNovoLembrete({ ...novoLembrete, data_hora: e.target.value })}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <select
          value={novoLembrete.tipo}
          onChange={e => setNovoLembrete({ ...novoLembrete, tipo: e.target.value })}
          style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        >
          <option value="personalizado">Personalizado</option>
          <option value="sabbat">Sabbat</option>
          <option value="lua">Lua</option>
          <option value="ritual">Ritual</option>
        </select>
        <button onClick={criarLembrete}>Salvar</button>
      </div>

      <h3>Próximos lembretes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {lembretes.map(l => (
          <div key={l.id} className="card">
            <h3>{l.titulo}</h3>
            <p>{l.descricao}</p>
            <div className="meta">
              {new Date(l.data_hora).toLocaleString('pt-BR')} – Tipo: {l.tipo}
            </div>
          </div>
        ))}
        {lembretes.length === 0 && <p>Nenhum lembrete futuro. Crie um!</p>}
      </div>
    </div>
  );
}

export default Lembretes;