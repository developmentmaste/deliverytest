import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import shopsRouter    from './routes/shops';
import productsRouter from './routes/products';
import ordersRouter   from './routes/orders';
import promosRouter   from './routes/promos';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;
const URI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/clover-delivery';

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/shops',    shopsRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders',   ordersRouter);
app.use('/api/promos',   promosRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

function startServer() {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

mongoose
  .connect(URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
    console.warn('⚠️ Starting server anyway (offline mode). Some API calls may fail until MongoDB is available.');
    startServer();
  });
