import { NEXT_CSRF_CONFIG } from './config';

export function politeLog(...args: unknown[]) {
  if (NEXT_CSRF_CONFIG.verbose) {
    console.log(...args); // eslint-disable-line no-console
  }
}
