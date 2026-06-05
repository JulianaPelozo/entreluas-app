const axios = require('axios');

async function obterClima(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&lang=pt_br&units=metric`;
  const response = await axios.get(url);
  const clima = response.data.weather[0].description; 
  return clima;
}

module.exports = { obterClima };