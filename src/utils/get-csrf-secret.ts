import { NEXT_CSRF_SECRET_KEY } from '../constants';
import { withCSRFProtection } from '../index';

export function getCSRFSecret(): string {
  const env = process.env;
  const err = new Error(`Missing environment variable ${NEXT_CSRF_SECRET_KEY}`);
  Error.captureStackTrace(err, withCSRFProtection);

  if (!(NEXT_CSRF_SECRET_KEY in env)) {
    throw err;
  }

  const secret = env[NEXT_CSRF_SECRET_KEY];

  if (!secret) {
    throw err;
  }

  return secret;
}
