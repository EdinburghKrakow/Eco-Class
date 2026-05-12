import crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt);

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
};

const verifyPassword = async (password, storedValue) => {
  if (!storedValue || typeof storedValue !== 'string') {
    return false;
  }

  const parts = storedValue.split('$');

  if (parts.length !== 3) {
    return false;
  }

  const [algorithm, salt, storedHash] = parts;

  if (algorithm !== 'scrypt' || !salt || !storedHash) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, 64);
  const derivedHashHex = derivedKey.toString('hex');

  const storedBuffer = Buffer.from(storedHash, 'hex');
  const derivedBuffer = Buffer.from(derivedHashHex, 'hex');

  if (storedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedBuffer);
};

export { hashPassword, verifyPassword };