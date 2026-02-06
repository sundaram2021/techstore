
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

export const resend = new Proxy(
  {},
  {
    get(_target, prop) {
      return Reflect.get(
        getResend() as unknown as Record<PropertyKey, unknown>,
        prop,
      );
    },
  },
) as unknown as Resend;
