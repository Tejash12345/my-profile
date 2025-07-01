import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// API routes
app.use('/projects', projectRoutes);
app.use('/profile', profileRoutes);
app.use('/skills', skillsRoutes);
app.use('/uploads', express.static(path.resolve('uploads')));

// === Serve frontend static files ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// MongoDB connect + server start
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
