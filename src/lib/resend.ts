
import { Resend } from 'resend';

let resendClient: Resend | undefined;

export function getResend() {
  if (resendClient) return resendClient;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  resendClient = new Resend(resendApiKey);
  return resendClient;
}

// Intentionally expose only the email-sending surface of Resend.
export const resend = {
  get emails() {
    return getResend().emails;
  },
} satisfies Pick<Resend, 'emails'>;
