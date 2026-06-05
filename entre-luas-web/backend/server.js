const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/roda-ano', require('./routes/roda-ano'));
app.use('/api/fases-lua', require('./routes/fases-lua'));
app.use('/api/rituais', require('./routes/rituais'));
app.use('/api/diario', require('./routes/diario'));
app.use('/api/lembretes', require('./routes/lembretes'));
app.use('/api/tarot', require('./routes/tarot'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});