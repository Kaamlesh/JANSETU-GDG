require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB, isAtlasConnected } = require('./config/db');
const runSeed = require('./seedData');
const { GrievanceStore } = require('./models/Grievance');

const grievanceRoutes = require('./routes/grievanceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const policyCopilotRoutes = require('./routes/policyCopilotRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow Vercel frontend and local development
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(morgan('dev'));

// Static uploads / assets folder if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'JanDrishti AI - Digital Public Infrastructure Backend',
    version: '1.0.0',
    bricsTheme: 'Track 1 - AI for DPI & Governance',
    database: isAtlasConnected() ? 'MongoDB Atlas (Connected)' : 'Active Hybrid Memory/JSON Store',
    googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT || 'gen-lang-client-0430258993',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/grievances', grievanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/policy-copilot', policyCopilotRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('<h1>JanDrishti AI API Gateway</h1><p>Digital Public Infrastructure for BRICS Citizen Grievance Fusion & Predictive Policy Allocation.</p><p>Endpoints: <code>/api/grievances</code>, <code>/api/analytics/overview</code>, <code>/api/policy-copilot/query</code>, <code>/api/whatsapp/simulate</code></p>');
});

// Auto-seed if database is empty on start
const startServer = async () => {
  await connectDB();
  
  const count = await GrievanceStore.countDocuments();
  if (count === 0) {
    console.log('⚡ Initializing first-run sample datasets for data.gov.in and citizen grievances...');
    try {
      await runSeed();
    } catch (e) {
      console.warn('Auto-seed warning:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`
===========================================================
  🚀 JanDrishti AI Engine is LIVE on http://localhost:${PORT}
  🌍 Track 1: AI for Digital Public Infrastructure (BRICS)
  📦 Architecture: MERN Stack (Decoupled Frontend & Backend)
  🔗 Endpoints:
     - Health:         http://localhost:${PORT}/api/health
     - Grievances:     http://localhost:${PORT}/api/grievances
     - Analytics:      http://localhost:${PORT}/api/analytics/overview
     - Policy Copilot: http://localhost:${PORT}/api/policy-copilot/query
     - WhatsApp Bot:   http://localhost:${PORT}/api/whatsapp/simulate
===========================================================
    `);
  });
};

startServer();

module.exports = app;
