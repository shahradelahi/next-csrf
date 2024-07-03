import deepmerge from 'deepmerge';

import { DEFAULT_MATCHER } from './constants';
import { NextCSRFConfig } from './typings';

let NEXT_CSRF_CONFIG: NextCSRFConfig = {
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env['NODE_ENV'] === 'production'
  },
  csrfErrorMessage: 'CSRF Verification Failed.',
  verbose: process.env['NODE_ENV'] !== 'production',
  matcher: [DEFAULT_MATCHER]
};

/**
 * Configure the CSRF settings.
 *
 * @param {NextCSRFConfig} config - The CSRF configuration settings.
 */
export function configureCSRF(config: NextCSRFConfig = {}) {
  NEXT_CSRF_CONFIG = deepmerge(NEXT_CSRF_CONFIG, config, {
    arrayMerge(_target: any[], source: any[]): any[] {
      return source;
    }
  });
}

export function getCSRFConfig() {
  return NEXT_CSRF_CONFIG;
}
