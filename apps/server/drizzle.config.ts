import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/database/migrations',
    schema: './src/database/schema.ts',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL || 'file:local.db',
        authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    },
    migrations: {
        table: '__migrations',
    },
    verbose: true,
    strict: true,
});
