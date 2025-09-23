import dotenv from 'dotenv';
import { bool, cleanEnv, num, str } from 'envalid';

dotenv.config({ quiet: true });

export const ENV = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ['development', 'production'],
        default: 'development',
    }),

    TZ: str({ default: 'America/Sao_Paulo' }),
    CUID_FINGERPRINT: str({ default: '4dCxI3LFvo' }),
    JWT_SECRET: str({ default: 'super-secret' }),
    BCRYPT_SALT_ROUNDS: num({ default: 10 }),
    OPENAI_AI_KEY: str(),
    TURSO_DATABASE_URL: str({ default: 'file:local.db' }),
    TURSO_AUTH_TOKEN: str({ default: undefined }),

    SMTP_HOST: str({ default: undefined }),
    SMTP_PORT: num({ default: 587 }),
    SMTP_FROM: str({ default: undefined }),
    SMTP_LOGIN: str({ default: undefined }),
    SMTP_PASSWORD: str({ default: undefined }),
    SMTP_SECURE: bool({ default: false }),
});
