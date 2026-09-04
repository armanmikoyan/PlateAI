'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AuthMeResponse } from '@/app/api/auth/types';
import { toast } from '@/app/ui/toast';
import { CONTACT_SECTION } from './constants';

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });

        if (response.ok) {
          const payload = (await response.json()) as AuthMeResponse;
          if (!cancelled) {
            setEmail(payload.user.email);
          }
        }
      } catch {
        // Leave email null; submission will use it as missing.
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage(null);
      setSending(true);

      if (!email) {
        setErrorMessage(CONTACT_SECTION.SIGN_IN_REQUIRED);
        setSending(false);
        return;
      }

      const form = e.currentTarget;
      const formData = new FormData(form);
      const message = String(formData.get('message') ?? '').trim();

      if (!message) {
        setSending(false);
        return;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, message }),
        });

        if (response.ok) {
          form.reset();
          toast.add({
            title: CONTACT_SECTION.FORM_SUCCESS,
            type: 'success',
            timeout: 3000,
          });
          return;
        }

        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(payload?.error ?? CONTACT_SECTION.FORM_ERROR);
      } catch {
        setErrorMessage(CONTACT_SECTION.FORM_SERVER_UNAVAILABLE);
      } finally {
        setSending(false);
      }
    },
    [email],
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-lg flex-col gap-5">
      {email ? null : (
        <p className="text-muted-foreground text-center text-sm">{CONTACT_SECTION.SIGN_IN_REQUIRED}</p>
      )}
      <div className="flex flex-col gap-1.5">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder={CONTACT_SECTION.FORM_MESSAGE_PLACEHOLDER}
          className="border-edge bg-surface text-content placeholder:text-muted-foreground resize-none rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={sending || !email}
        aria-disabled={sending || !email}
        className="text-button-default-fg inline-flex h-11 items-center justify-center rounded-lg px-5 text-base font-medium disabled:opacity-50"
        style={{
          background: 'linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)',
        }}
      >
        {sending ? CONTACT_SECTION.FORM_SENDING : CONTACT_SECTION.FORM_SUBMIT}
      </button>
      {errorMessage ? (
        <p className="text-center text-sm font-medium text-red-600" role="status">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
