import React from 'react';

const MoonPhase = ({ phase, illumination }) => {
  const getMoonSymbol = () => {
    switch(phase) {
      case 'Nova': return '🌑';
      case 'Crescente': return '🌒';
      case 'Quarto Crescente': return '🌓';
      case 'Crescente Gibosa': return '🌔';
      case 'Cheia': return '🌕';
      case 'Minguante Gibosa': return '🌖';
      case 'Quarto Minguante': return '🌗';
      case 'Minguante': return '🌘';
      default: return '🌙';
    }
  };

  return (
    <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>
      <span style={{ fontSize: '2rem' }}>{getMoonSymbol()}</span>
      {illumination && <span> {illumination}%</span>}
      <p style={{ fontSize: '0.9rem', margin: '0' }}>{phase}</p>
    </div>
  );
};

export default MoonPhase;