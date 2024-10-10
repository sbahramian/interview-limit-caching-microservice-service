import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export function MONGO_CONFIG(
  db_key: string = 'MONGO_DB',
  host_key: string = 'MONGO_HOST',
  user_key: string = 'MONGO_USER',
  password_key: string = 'MONGO_PASS',
  port_key: string = 'MONGO_PORT',
  query_key: string = 'MONGO_QUERY',
): string {
  const username = process.env[user_key] || null;
  const password = process.env[password_key] || null;
  const database = process.env[db_key] || 'develop';
  const port = process.env[port_key] || '27017';
  const host = process.env[host_key] || 'localhost';
  const query = process.env[query_key] || 'authSource=admin';

  let uri = null;
  if (!username && !password) {
    uri = `mongodb://${host}:${port}/${database}?${query}`;
  } else {
    if (port === 'null') {
      uri = `mongodb+srv://${username}:${password}@${host}/${database}?${query}`;
    } else {
      uri = `mongodb://${username}:${password}@${host}:${port}/${database}?${query}`;
    }
  }
  console.log('Connect mongodb', uri);
  return uri;
}

export function MONGO_LOGGING_CONFIG(key: string = 'MONGO_LOGGING'): boolean {
  const value = process?.env[key];
  return value === 'true' || value === '1';
}
