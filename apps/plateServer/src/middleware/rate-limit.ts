import { rateLimit } from 'express-rate-limit';
import type { RequestHandler } from 'express';

const RATE_LIMIT_ERROR = 'Too many requests. Try again later.' as const;

export function authRateLimiter(): RequestHandler {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: RATE_LIMIT_ERROR },
  });
}

export function contactRateLimiter(): RequestHandler {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (request) => request.authUser?.id ?? request.ip ?? 'anonymous',
    message: { error: RATE_LIMIT_ERROR },
  });
}

export function analyzeRateLimiter(): RequestHandler {
  return rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (request) => request.authUser?.id ?? 'anonymous',
    message: { error: RATE_LIMIT_ERROR },
  });
}