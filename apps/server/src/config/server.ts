import http from 'node:http';

import { allowedOrigins } from '@config/allowed-origins';
import { logger } from '@config/logger';
import { error } from '@middleware/error';
import { notFound } from '@middleware/not-found';

import cors from 'cors';
import type { Express } from 'express';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';

export default class Server {
    private app: Express;
    private server: http.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);

        this.app.use(json());
        this.app.use(urlencoded({ extended: true }));

        this.app.use(helmet());
        this.app.use(cors({ origin: allowedOrigins }));

        for (const allowedOrigin of allowedOrigins) {
            logger.info({ origin: allowedOrigin }, 'Allowed origin');
        }
    }

    public router(routes: (app: Express) => void): Server {
        routes(this.app);
        return this;
    }

    public listen(port: number): {
        app: Express;
        server: http.Server;
    } {
        this.app.use(notFound);
        this.app.use(error);

        this.server.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });

        return { app: this.app, server: this.server };
    }
}
