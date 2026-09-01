export type ServerConfig = Readonly<{
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
}>;
