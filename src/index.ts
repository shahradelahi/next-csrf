import cookie from 'cookie';
import { cookies } from 'next-extra/action';
import { NextRequest, NextResponse } from 'next/server';

import { getCSRFConfig } from './config';
import { NEXT_CSRF_KEY } from './constants';
import { politeLog } from './logger';
import { MiddlewareFn } from './typings';
import { generateToken, validateToken } from './utils/token';

// ------------------------------------

export function withCSRFProtection(fn: MiddlewareFn): MiddlewareFn {
  return async (req: NextRequest) => {
    const matchers = getCSRFConfig().matcher ?? [];
    if (!matchers.length) {
      throw new Error('withCSRFProtection requires at least one route matcher');
    }

    let isMatch = false;
    for (const { pattern, ignoredMethods, handler } of matchers) {
      if (
        pattern.test(req.nextUrl.pathname) &&
        (ignoredMethods === false
          ? true
          : ignoredMethods === undefined
            ? /^(GET|HEAD|OPTIONS)$/i.test(req.method)
            : !ignoredMethods.some((v) => v.toLowerCase() === req.method.toLowerCase())) &&
        (handler ? !(await handler(req)) : false)
      ) {
        isMatch = true;
        break;
      }
    }

    const token = req.cookies.get(NEXT_CSRF_KEY);

    if (isMatch) {
      if (!token) {
        politeLog('[warn] - Client sent a request without a CSRF token.');
        // Create a new CSRF token
        const headers = new Headers(req.headers);
        headers.set(
          'Set-Cookie',
          cookie.serialize(NEXT_CSRF_KEY, generateToken(), getCSRFConfig().cookieOptions)
        );

        return new NextResponse(getCSRFConfig().csrfErrorMessage, {
          status: 403,
          headers
        });
      }

      if (token && !validateToken(token.value)) {
        politeLog('[warn] - Client sent an invalid CSRF token.');
        return new NextResponse('403 Forbidden', { status: 403 });
      }
    }

    const res = await fn(req);
    if (!token) {
      res.cookies.set(NEXT_CSRF_KEY, generateToken(), getCSRFConfig().cookieOptions);
    }
    return res;
  };
}

/**
 * Get the current CSRF token from the cookies.
 *
 * @returns {string|undefined} - The current CSRF token or undefined if not found.
 */
export function getCSRFToken(): string | undefined {
  const token = cookies().get(NEXT_CSRF_KEY);
  return token?.value;
}

/**
 * Creates a new CSRF token and sets it in the cookies.
 *
 * @returns {string} - The newly generated CSRF token.
 */
export function refreshCSRFToken(): string {
  const token = generateToken();
  cookies().set(NEXT_CSRF_KEY, token, getCSRFConfig().cookieOptions);
  return token;
}

// ------------------------------------

export { generateToken, validateToken } from './utils/token';
export { configureCSRF } from './config';

// -- Types ---------------------------

export type { CSRFTokensOptions } from './utils/token';
export type * from './typings';
