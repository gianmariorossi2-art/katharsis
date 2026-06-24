import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import horoscopeRouter from './routes/horoscope';
import oracleRouter from './routes/oracle';
import stripeRouter from './routes/stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
    credentials: true,
  })
);

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Feature routes
app.use('/api/horoscope', horoscopeRouter);
app.use('/api/oracle', oracleRouter);
app.use('/api/stripe', stripeRouter);

// In production serve the React SPA
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🔮 Katharsis server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   CORS allowed origin: ${CLIENT_URL}`);
});

export default app;
