import mongoose from 'mongoose';

import type { ServerConfig } from '@/types.js';

export async function connectDatabase(config: ServerConfig): Promise<void> {
  await mongoose.connect(config.MONGODB_URI);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
