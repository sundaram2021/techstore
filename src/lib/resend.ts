
import { Resend } from 'resend';

let resendClient: Resend | undefined;

export class MissingResendApiKeyError extends Error {
  constructor() {
    super(
      'Resend is not configured: RESEND_API_KEY is not set. Set RESEND_API_KEY to enable email sending.',
    );
    this.name = 'MissingResendApiKeyError';
  }
}

export function getResend() {
  if (resendClient) return resendClient;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new MissingResendApiKeyError();
  }

  resendClient = new Resend(resendApiKey);
  return resendClient;
}

// Intentionally expose only the email-sending surface of Resend.
export const resend = {
  get emails() {
    // Accessing this will throw if RESEND_API_KEY is missing.
    return getResend().emails;
  },
} satisfies Pick<Resend, 'emails'>;
