import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import api from './services/api';
import MoonPhase from './components/MoonPhase';
import RodaAno from './pages/RodaAno';
import Diario from './pages/Diario';
import Rituais from './pages/Rituais';
import Tarot from './pages/Tarot';
import Lembretes from './pages/Lembretes';
import './App.css';

function App() {
  const [moon, setMoon] = useState(null);

  useEffect(() => {
    api.get('/fases-lua')
      .then(res => setMoon(res.data))
      .catch(err => console.error('Erro ao buscar fase lunar:', err));
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="logo">
            <h1>🌙 EntreLuas</h1>
            {moon && <MoonPhase phase={moon.fase} illumination={moon.iluminacao} />}
          </div>
          <nav>
            <Link to="/">Roda do Ano</Link>
            <Link to="/diario">Diário</Link>
            <Link to="/rituais">Rituais</Link>
            <Link to="/tarot">Tarot</Link>
            <Link to="/lembretes">Lembretes</Link>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<RodaAno />} />
            <Route path="/diario" element={<Diario />} />
            <Route path="/rituais" element={<Rituais />} />
            <Route path="/tarot" element={<Tarot />} />
            <Route path="/lembretes" element={<Lembretes />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>✨ EntreLuas – Conecte-se com os ciclos da natureza ✨</p>
          <p>Desenvolvido por Juliana Pelozo Pacheco | 2026</p> 
          <p>Dados de fases lunares por Lunar API | Clima por OpenWeather</p>
          <p>Backend em Node.js/Express com MySQL | Frontend em React</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;