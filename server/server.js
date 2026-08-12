import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import noteRoutes from './routes/note.routes.js';
import reportRoutes from './routes/report.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';
import aiRoutes from './routes/ai.routes.js';
import userRoutes from './routes/user.routes.js';
import auditRoutes from './routes/audit.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parsing
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'AI DOCPAD Medical Record Management System API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 AI DOCPAD Backend Server listening on http://localhost:${PORT}`);
});
