import type { CookieSerializeOptions } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

export interface NextCSRFConfig extends Record<string, any> {
  cookieOptions?: CookieSerializeOptions;
  matcher?: (Matcher | RegExp)[];
  /** Error message to return for unauthorized requests. Default is "CSRF Verification Failed.". */
  csrfErrorMessage?: string;
  verbose?: boolean;
}

export interface Matcher {
  pattern: RegExp;
  ignoreMethods?: string[];
}

export interface MiddlewareFn {
  (req: NextRequest): Promise<NextResponse> | NextResponse;
}
