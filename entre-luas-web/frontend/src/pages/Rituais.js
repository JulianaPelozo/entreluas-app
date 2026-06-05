import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Rituais() {
  const [rituais, setRituais] = useState([]);
  const [ritualGerado, setRitualGerado] = useState(null);

  useEffect(() => {
    carregarRituais();
  }, []);

  async function carregarRituais() {
    const res = await api.get('/rituais');
    setRituais(res.data);
  }

  async function gerarNovoRitual() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await api.post('/rituais/gerar-automatico', {
        usuarioId: 1,
        lat: latitude,
        lon: longitude
      });
      setRitualGerado(res.data);
      carregarRituais(); 
    });
  }

  return (
    <div>
      <h1>✨ Rituais EntreLuas</h1>
      <button onClick={gerarNovoRitual}>🌙 Gerar Ritual para Agora</button>
      {ritualGerado && (
        <div style={{ border: '2px solid gold', margin: '20px', padding: '10px' }}>
          <h3> Ritual Gerado Especialmente para Você</h3>
          <strong>{ritualGerado.titulo}</strong>
          <p>{ritualGerado.descricao}</p>
          <small>Fase lunar: {ritualGerado.fase_lua_sugerida} | Clima: {ritualGerado.clima_sugerido}</small>
        </div>
      )}
      <h2>Biblioteca de Rituais</h2>
      {rituais.map(r => (
        <div key={r.id}>
          <h4>{r.titulo}</h4>
          <p>{r.descricao}</p>
          {r.e_gerado && <span>Gerado automaticamente</span>}
        </div>
      ))}
    </div>
  );
}

export default Rituais;