import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { setupSockets } from './sockets/socketManager.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swapRoutes from './routes/swapRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB Database
connectDB();

// Allowed origins for CORS (supports local, Vercel production, preview deployments, and custom env)
const defaultAllowedOrigins = [
  'https://skillswaplive.vercel.app',
  'https://skillswaplive.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

if (process.env.CLIENT_URL) {
  defaultAllowedOrigins.push(process.env.CLIENT_URL.trim().replace(/\/$/, ''));
}

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (tools, server-to-server, curl)
  const cleanOrigin = origin.trim().replace(/\/$/, '');
  
  if (defaultAllowedOrigins.includes(cleanOrigin)) return true;
  if (cleanOrigin.startsWith('http://localhost:') || cleanOrigin.startsWith('http://127.0.0.1:')) return true;
  if (cleanOrigin.endsWith('.vercel.app') || cleanOrigin.endsWith('.onrender.com')) return true;
  
  return true; // Safe permissive fallback for cross-origin SPA
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

// Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

setupSockets(io);

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Explicit fallback headers middleware to ensure headers are always present
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Server Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SkillSwapLive Backend API',
    message: 'SkillSwapLive API is running smoothly',
    deployed_client: 'https://skillswaplive.vercel.app',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SkillSwapLive API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 SkillSwapLive Server is running on port ${PORT}`);
  console.log(`📡 Socket.io signaling active`);
  console.log(`🌐 Client Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`=============================================`);
});
