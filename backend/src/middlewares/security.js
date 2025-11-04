import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const securityMiddleware = [
  helmet(),
  cors({
    origin: allowedOrigin,
    credentials: true, // para cookies httpOnly
  }),
  cookieParser(),
];
