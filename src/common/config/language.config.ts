import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export function DEFAULT_LANGUAGE_CONFIG(key: string = 'DEFAULT_LANGUAGE'): string {
  return process.env[key] || 'ENGLISH';
}
