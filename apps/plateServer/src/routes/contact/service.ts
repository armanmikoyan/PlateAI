import { createTransport } from 'nodemailer';
import type { ContactMessageBody } from '@/routes/contact/types.js';
import type { EmailConfig } from '@/config/types.js';

export async function sendContactMessage(config: EmailConfig, body: ContactMessageBody): Promise<boolean> {
  try {
    const transporter = createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_PORT === 465,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `PlateAI <${config.EMAIL_USER}>`,
      to: config.EMAIL_USER,
      replyTo: body.email,
      subject: 'New PlateAI contact request',
      text: `From: ${body.email}\n\n${body.message}`,
    });

    return true;
  } catch (error) {
    console.error('[contact] failed to send email', error);
    return false;
  }
}
