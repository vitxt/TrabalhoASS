const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./database');

const authRoutes = require('./routes/auth');
const influencersRoutes = require('./routes/influencers');
const campaignsRoutes = require('./routes/campaigns');
const proposalsRoutes = require('./routes/proposals');
const contractsRoutes = require('./routes/contracts');
const disputesRoutes = require('./routes/disputes');
const reviewsRoutes = require('./routes/reviews');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rotas da API RESTful
app.use('/api/auth', authRoutes);
app.use('/api/influencers', influencersRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/disputes', disputesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Plataforma de Conexao entre Empresas e Influenciadores',
    institution: 'UEM - Analise de Sistemas de Software',
    authors: ['Vitor Teodoro Correa (RA 143757)', 'Arthur Spirandelli (RA 144136)'],
    timestamp: new Date().toISOString()
  });
});

// Inicialização
async function startServer() {
  try {
    await initDB();
    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`Backend API rodando com sucesso na porta ${PORT}`);
      console.log(`Endpoint de status: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
    return server;
  } catch (err) {
    console.error('Erro fatal ao iniciar servidor:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
