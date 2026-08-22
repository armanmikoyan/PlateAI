import mongoose from 'mongoose';

import type { ServerConfig } from '@/types.js';

export async function connectDatabase(config: ServerConfig): Promise<void> {
  await mongoose.connect(config.MONGODB_URI);
  console.log('Connected to MongoDB');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
