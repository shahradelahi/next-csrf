import type { CookieSerializeOptions } from 'cookie';
import type { NextRequest, NextResponse } from 'next/server';

export interface NextCSRFConfig extends Record<string, any> {
  cookieOptions?: CookieSerializeOptions;
  matcher?: Matcher[];
  /**
   * Error message to return for unauthorized requests. Default is "CSRF Verification Failed.".
   */
  csrfErrorMessage?: string;
  verbose?: boolean;
}

export interface Matcher {
  pattern: RegExp;
  /**
   * List of request methods to ignore. Default is ["GET", "HEAD", "OPTIONS"]. By setting this to `false`, no request methods will be ignored.
   */
  ignoredMethods?: string[] | false;
  /**
   * Custom handler to determine if the request should be ignored.Return `true` to ignore the request, or `false` to protect the route.
   */
  handler?: MatcherHandlerFn;
}

type MatcherHandlerFn = (req: NextRequest) => Promise<boolean> | boolean;

export interface MiddlewareFn {
  (req: NextRequest): Promise<NextResponse> | NextResponse;
}
