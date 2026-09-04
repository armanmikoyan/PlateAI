import type { NextFunction, Request, Response } from 'express';
import { CONTACT_ERRORS } from '@/routes/contact/constants.js';
import { sendContactMessage } from '@/routes/contact/service.js';
import { parseContactMessageBody } from '@/routes/contact/utils.js';
import type { ContactMessageResponse } from '@/routes/contact/types.js';
import type { EmailConfig } from '@/config/types.js';

export function createContactHandler(config: EmailConfig) {
  return async function handleContact(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = parseContactMessageBody(request.body);

      if (!body) {
        response.status(400).json({ error: CONTACT_ERRORS.INVALID_BODY });
        return;
      }

      const sent = await sendContactMessage(config, body);

      if (!sent) {
        response.status(502).json({ error: CONTACT_ERRORS.SEND_FAILED });
        return;
      }

      response.status(200).json({ ok: true } satisfies ContactMessageResponse);
    } catch (error) {
      next(error);
    }
  };
}
