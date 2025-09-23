import type express from 'express';
import chatRouter from '@resources/chat/router'

export default function routes(app: express.Application) {
    app.use('/chat', chatRouter);
    // Example:
    // app.use('/users', usersRouter);
}
