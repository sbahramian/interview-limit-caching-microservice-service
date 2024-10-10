import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export function REDIS_CONFIG(
  db_key: string = 'REDIS_DB',
  host_key: string = 'REDIS_HOST',
  user_key: string = 'REDIS_USER',
  password_key: string = 'REDIS_PASS',
  port_key: string = 'REDIS_PORT',
): string {
  const host = process.env[host_key] || 'localhost';
  const port = parseInt(process.env[port_key] || '6379');
  const password = process.env[password_key] || null;
  const username = process.env[user_key] || null;
  const database = process.env[db_key] || null;

  let url = `redis://${host}:${port}`;

  if (username && password) {
    url = `redis://${username}:${password}@${host}:${port}`;
  } else if (username) {
    url = `redis://${username}:@${host}:${port}`;
  } else if (password) {
    url = `redis://:${password}@${host}:${port}`;
  }

  if (database && database !== undefined) {
    url += `/${database}`;
  }
  console.log('Connect Redis', url);
  return url;
}
