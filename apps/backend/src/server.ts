import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRoutes } from './modules/auth/auth.routes';
import { usersRoutes } from './modules/users/users.routes';
import { rolesRoutes } from './modules/roles/roles.routes';
import { permissionsRoutes } from './modules/permissions/permissions.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { productsRouter } from './modules/products/products.routes';
import { attachmentsRouter } from './modules/attachments/attachments.routes';
import { bomsRouter } from './modules/boms/boms.routes';
import { ecosRouter } from './modules/ecos/ecos.routes';
import { approvalsRouter } from './modules/approvals/approvals.routes';
import { versionsRouter } from './modules/versions/versions.routes';
import { auditRouter } from './modules/audit/audit.routes';
import { dashboardRouter, reportsRouter } from './modules/reports/reports.routes';
import { searchRouter } from './modules/search/search.routes';
import { notificationsRouter } from './modules/notifications/notifications.routes';
dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 3000;

import morgan from 'morgan';
import logger from './utils/logger';

app.use(cors({
  origin: process.env.SERVER_CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);
app.use(morganMiddleware);

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` for dev
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('ECOFlow Backend API Running');
});

// Health Checks
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const prisma = require('./utils/prisma').default;
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/products/:id/attachments', attachmentsRouter);
app.use('/api/boms', bomsRouter);
app.use('/api/ecos', ecosRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/versions', versionsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/search', searchRouter);
app.use('/api/notifications', notificationsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
