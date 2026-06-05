import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import api from './services/api';
import RodaAno from './pages/RodaAno';
import Diario from './pages/Diario';
import Rituais from './pages/Rituais';
import Tarot from './pages/Tarot';
import Lembretes from './pages/Lembretes';

function App() {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        await api.post('/rituais/gerar-automatico', {
          usuarioId: 1, 
          lat: latitude,
          lon: longitude,
        });
      } catch (error) {
        console.error('Erro ao gerar ritual automático:', error);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Roda do Ano</Link> |{' '}
          <Link to="/diario">Diário</Link> |{' '}
          <Link to="/rituais">Rituais</Link> |{' '}
          <Link to="/tarot">Tarot</Link> |{' '}
          <Link to="/lembretes">Lembretes</Link>
        </nav>
        <Routes>
          <Route path="/" element={<RodaAno />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/rituais" element={<Rituais />} />
          <Route path="/tarot" element={<Tarot />} />
          <Route path="/lembretes" element={<Lembretes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;