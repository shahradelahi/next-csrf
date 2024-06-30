import cookie from 'cookie';
import { cookies } from 'next-extra/action';
import { NextRequest, NextResponse } from 'next/server';

import { NEXT_CSRF_CONFIG } from './config';
import { NEXT_CSRF_KEY } from './constants';
import { politeLog } from './logger';
import { Matcher, MiddlewareFn } from './typings';
import { generateToken, validateToken } from './utils/token';

// ------------------------------------

export function withCSRFProtection(fn: MiddlewareFn): MiddlewareFn {
  return async (req: NextRequest) => {
    const matchers = NEXT_CSRF_CONFIG.matcher ?? [];
    if (!matchers.length) {
      throw new Error('withCSRFProtection requires at least one route matcher');
    }

    const isMatch = matchers.some((v) => {
      const { pattern, ignoreMethods } = (v instanceof RegExp ? { pattern: v } : v) as Matcher;
      const pathMatch = pattern.test(req.nextUrl.pathname);
      if (!pathMatch) {
        return false;
      }

      if (Array.isArray(ignoreMethods)) {
        return !ignoreMethods.some((v) => v.toLowerCase() === req.method.toLowerCase());
      }

      return /^(GET|HEAD|OPTIONS)$/.test(req.method);
    });

    const token = req.cookies.get(NEXT_CSRF_KEY);

    if (isMatch) {
      if (!token) {
        politeLog('[warn] - Client sent a request without a CSRF token.');
        // Create a new CSRF token
        const headers = new Headers(req.headers);
        headers.set(
          'Set-Cookie',
          cookie.serialize(NEXT_CSRF_KEY, generateToken(), NEXT_CSRF_CONFIG.cookieOptions)
        );

        return new NextResponse(NEXT_CSRF_CONFIG.csrfErrorMessage, {
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
      res.cookies.set(NEXT_CSRF_KEY, generateToken(), NEXT_CSRF_CONFIG.cookieOptions);
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
  cookies().set(NEXT_CSRF_KEY, token, NEXT_CSRF_CONFIG.cookieOptions);
  return token;
}

// ------------------------------------

export { generateToken, validateToken } from './utils/token';
export { configureCSRF } from './config';

// -- Types ----------------------------

export type { CSRFTokensOptions } from './utils/token';
export type * from './typings';
