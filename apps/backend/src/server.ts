import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRoutes } from './modules/auth/auth.routes';

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT || 3000;

app.use(cors({
  origin: process.env.SERVER_CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('ECOFlow Backend API Running');
});

// Routes
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
