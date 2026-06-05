import React, { useState } from 'react';
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
    setInterpretacao(texto);

   
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/tarot', {
          cartas: selecionadas,
          interpretacao: texto,
          contexto: 'geral'
        }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (err) { console.error(err); }
    }
  }

  return (
    <div className="container">
      <h1>Tarot Digital</h1>
      <button onClick={() => tirarCartas(3)}>Tirar 3 cartas</button>
      <div style={{ margin: '2rem 0', fontSize: '1.5rem' }}>
        {cartas.map((c, i) => <span key={i}>🃏 {c} &nbsp;</span>)}
      </div>
      <p>{interpretacao}</p>
      <small>Em breve integração com rituais baseada no livro de tarot.</small>
    </div>
  );
}

export default Tarot;