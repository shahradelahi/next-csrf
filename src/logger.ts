import { getCSRFConfig } from './config';

export function politeLog(...args: unknown[]) {
  if (getCSRFConfig().verbose) {
    console.log(...args); // eslint-disable-line no-console
  }
}
