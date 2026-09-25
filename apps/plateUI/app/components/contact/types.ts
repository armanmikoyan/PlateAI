export type ContactErrorResponse = Readonly<{
  error?: string;
  retryAfterSeconds?: number;
}>;
