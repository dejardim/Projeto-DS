import { ENV } from '@config/env';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, {
    logger: ENV.NODE_ENV === 'development',
});
