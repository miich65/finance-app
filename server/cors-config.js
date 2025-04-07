// Configurazione CORS più dettagliata se necessario
const corsOptions = {
    origin: ['http://localhost:3000', 'http://client:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true
  };
  
  module.exports = corsOptions;