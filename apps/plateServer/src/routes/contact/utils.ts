import type { ContactMessageInput } from '@/routes/contact/types.js';

const MESSAGE_MAX_LENGTH = 5000;

export function parseContactMessageBody(body: unknown): ContactMessageInput | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const candidate = body as Record<string, unknown>;
  const message = typeof candidate.message === 'string' ? candidate.message.trim() : '';

  if (!message || message.length > MESSAGE_MAX_LENGTH) {
    return null;
  }

  return { message };
}
