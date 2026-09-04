import type { ContactMessageBody } from '@/routes/contact/types.js';

const EMAIL_MAX_LENGTH = 320;
const MESSAGE_MAX_LENGTH = 5000;

export function parseContactMessageBody(body: unknown): ContactMessageBody | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const candidate = body as Record<string, unknown>;
  const email = typeof candidate.email === 'string' ? candidate.email.trim() : '';
  const message = typeof candidate.message === 'string' ? candidate.message.trim() : '';

  if (!email || !message || email.length > EMAIL_MAX_LENGTH || message.length > MESSAGE_MAX_LENGTH) {
    return null;
  }

  return { email, message };
}
