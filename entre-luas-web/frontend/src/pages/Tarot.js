import React, { useState } from 'react';
import api from '../services/api';

const cartas = [
  "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador", 
  "O Hierofante", "Os Enamorados", "A Carruagem", "A Justiça", "O Eremita",
  "Roda da Fortuna", "A Força", "O Enforcado", "A Morte", "A Temperança",
  "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"
];

function Tarot() {
  const [cartasSorteadas, setCartasSorteadas] = useState([]);
  const [interpretacao, setInterpretacao] = useState('');

  async function tirarCartas(qtd = 3) {
    const embaralhadas = [...cartas];
    for (let i = embaralhadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
    }
    const selecionadas = embaralhadas.slice(0, qtd);
    setCartasSorteadas(selecionadas);
    // Gerar interpretação simples
    let texto = `Você tirou: ${selecionadas.join(', ')}. `;
    if (selecionadas.includes("A Sacerdotisa")) texto += "Ouça sua intuição. ";
    if (selecionadas.includes("O Sol")) texto += "Alegria e sucesso estão a caminho. ";
    setInterpretacao(texto);

    // Salvar no banco (opcional)
    await api.post('/tarot', {
      usuarioId: 1,
      cartas: selecionadas,
      interpretacao: texto,
      contexto: 'geral'
    });
  }

  return (
    <div>
      <h1>Tarot Digital</h1>
      <button onClick={() => tirarCartas(3)}>Tirar 3 cartas</button>
      <div>
        {cartasSorteadas.map((c, i) => <span key={i}>🃏 {c} </span>)}
      </div>
      <p>{interpretacao}</p>
      <small>Em breve integração com livro de rituais!</small>
    </div>
  );
}

export default Tarot;