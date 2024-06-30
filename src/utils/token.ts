import { randomBase62 } from '@se-oss/rand';
import { sha256, timeSafeCompare } from '@se-oss/sha256';

import { base64url } from './base64url';
import { getCSRFSecret } from './get-csrf-secret';

export interface CSRFTokensOptions {
  /** The string length of the salt (default: 8) */
  saltLength?: number;
}

export class CSRFTokens {
  readonly #secret: string;
  readonly #saltLength: number = 8;

  constructor(secret: string, options?: CSRFTokensOptions) {
    if (!secret || typeof (secret as any) !== 'string') {
      throw new TypeError('argument secret is required');
    }

    this.#secret = secret;

    if (options) {
      if (options.saltLength) {
        this.#saltLength = options.saltLength;
      }
    }
  }

  /**
   * Tokenize a secret and salt.
   */
  #tokenize(salt: string): string {
    return salt + '-' + base64url(sha256(salt + '-' + this.#secret));
  }

  /**
   * Create a new CSRF token.
   */
  create(): string {
    return this.#tokenize(randomBase62(this.#saltLength));
  }

  /**
   * Verify if a given token is valid for a given secret.
   */
  verify(secret: any, token: any): boolean {
    if (!secret || typeof secret !== 'string') {
      return false;
    }

    if (!token || typeof token !== 'string') {
      return false;
    }

    const index = token.indexOf('-');

    if (index === -1) {
      return false;
    }

    const salt = token.slice(0, index);
    const expected = this.#tokenize(salt);

    return timeSafeCompare(token, expected);
  }
}

export function generateToken(options?: CSRFTokensOptions): string {
  const csrf = new CSRFTokens(getCSRFSecret(), options);
  return csrf.create();
}

export function validateToken(token: string, options?: CSRFTokensOptions): boolean {
  const csrf = new CSRFTokens(getCSRFSecret(), options);
  return csrf.verify(getCSRFSecret(), token);
}
