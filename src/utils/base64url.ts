export function base64url(input: string | Buffer | Uint8Array): string {
  return Buffer.from(input).toString('base64url');
}
