import morgan from 'morgan';
import type { RequestHandler } from 'express';
import type { ServerConfig } from '@/config/types.js';

export function requestLogger(config: ServerConfig): RequestHandler {
  return morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev');
}