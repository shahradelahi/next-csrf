import { Matcher } from './typings';

export const DEFAULT_MATCHER: Matcher = {
  pattern: /^\/((?!_next\/static|_next\/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS']
};

export const NEXT_CSRF_KEY = 'next-csrf';

export const NEXT_CSRF_SECRET_KEY = 'NEXT_CSRF_SECRET';
