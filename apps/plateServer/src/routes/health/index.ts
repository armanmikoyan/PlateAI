import { Router } from 'express';
import mongoose from 'mongoose';

async function checkDb(): Promise<boolean> {
  try {
    if (!mongoose.connection.db) {
      return false;
    }
    await mongoose.connection.db.admin().ping();
    return true;
  } catch {
    return false;
  }
}

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/', async (_request, response) => {
    const dbReady = await checkDb();
    const status = dbReady ? 'healthy' : 'degraded';
    response.status(dbReady ? 200 : 503).json({ status, db: dbReady ? 'connected' : 'disconnected' });
  });

  return router;
}
