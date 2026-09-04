export type EmailConfig = Readonly<{
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}>;

export type ServerConfig = Readonly<{
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  LEMON_SQUEEZY_API_KEY: string;
  LEMON_SQUEEZY_WEBHOOK_SECRET: string;
  LEMON_SQUEEZY_STORE_ID: string;
  LEMON_SQUEEZY_VARIANT_ID_BASIC: string;
  LEMON_SQUEEZY_VARIANT_ID_PRO: string;
  LEMON_SQUEEZY_TEST_MODE: boolean;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
}>;
