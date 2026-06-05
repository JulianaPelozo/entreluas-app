import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Rituais() {
  const [rituais, setRituais] = useState([]);
  const [ritualGerado, setRitualGerado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarRituais();
  }, []);

  async function carregarRituais() {
    try {
      const res = await api.get('/rituais');
      setRituais(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function gerarRitual() {
    setCarregando(true);
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
      setCarregando(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await api.post('/rituais/gerar-automatico', {
          usuarioId: 1, // depois ajustar com login
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
        setRitualGerado(res.data);
        carregarRituais();
      } catch (err) {
        console.error(err);
        alert('Erro ao gerar ritual. Verifique o backend.');
      } finally {
        setCarregando(false);
      }
    });
  }

  return (
    <div>
      <h2>✨ Rituais</h2>
      <button onClick={gerarRitual} disabled={carregando}>
        {carregando ? 'Gerando...' : 'Gerar ritual agora'}
      </button>

      {ritualGerado && (
        <div className="card" style={{ margin: '1.5rem 0', background: 'rgba(233, 69, 96, 0.2)', borderColor: '#e94560' }}>
          <h3>Ritual especial para você</h3>
          <h4>{ritualGerado.titulo}</h4>
          <p>{ritualGerado.descricao}</p>
          <div className="meta">
            Fase lunar: {ritualGerado.fase_lua_sugerida} | Clima: {ritualGerado.clima_sugerido}
          </div>
        </div>
      )}

      <h3>Biblioteca de rituais</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {rituais.map(r => (
          <div key={r.id} className="card">
            <h3>{r.titulo}</h3>
            <p>{r.descricao}</p>
            {r.e_gerado && <span className="meta"> Gerado automaticamente</span>}
            <div className="meta">⏱ Duração: {r.duracao_minutos} min</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rituais;