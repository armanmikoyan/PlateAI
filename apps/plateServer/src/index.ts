import 'dotenv/config';
import { readServerConfig } from '@/config/index.js';
import { connectDatabase } from '@/database/index.js';
import { createApp } from '@/app/index.js';

async function main() {
  const config = readServerConfig();

  await connectDatabase(config);

  const app = createApp(config);

  app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Auth server listening on http://0.0.0.0:${config.PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
