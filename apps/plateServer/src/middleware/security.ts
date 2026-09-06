import cors from 'cors';
import helmet from 'helmet';
import type { RequestHandler } from 'express';
import type { ServerConfig } from '@/config/types.js';

export function security(config: ServerConfig): RequestHandler[] {
  return [
    helmet(),
    cors({
      origin: [config.FRONTEND_URL],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    }),
  ];
}