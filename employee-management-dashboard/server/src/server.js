import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Global middleware ---
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json()); // parse JSON request bodies

// --- Health check ---
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Management Dashboard API is running',
    status: 'ok',
    endpoints: {
      health: '/api/health',
      login: '/api/auth/login',
      employees: '/api/employees',
      stats: '/api/employees/stats/summary',
    },
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// --- Feature routes ---
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// --- 404 + centralized error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to the DB first, then start listening. If the DB is unreachable
// we fail fast instead of serving an app that can't do anything.
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
