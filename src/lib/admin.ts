import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'ottfree_admin';

export const DEV_ADMIN_USERNAME = 'admin';
export const DEV_ADMIN_PASSWORD = 'admin123';

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'development-only-secret'
  );
}

export function signAdminSession(value = 'admin') {
  const sig = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  return `${value}.${sig}`;
}

export function verifyAdminSession(token?: string) {
  if (!token) return false;
  const [value, sig] = token.split('.');
  if (!value || !sig) return false;
  const expected = crypto
    .createHmac('sha256', secret())
    .update(value)
    .digest('hex');
  return (
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  );
}

export function isAdmin() {
  return verifyAdminSession(cookies().get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME };

export function getConfiguredAdminCredentials() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    username:
      process.env.ADMIN_USERNAME || (!isProduction ? DEV_ADMIN_USERNAME : ''),
    password:
      process.env.ADMIN_PASSWORD || (!isProduction ? DEV_ADMIN_PASSWORD : ''),
    usingDevelopmentFallback:
      !isProduction &&
      (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD),
  };
}
