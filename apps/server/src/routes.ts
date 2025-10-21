import type express from 'express';
import categoriesRouter from './resources/categories/router';
import expensesRouter from './resources/expenses/router';
import paymentOptionsRouter from './resources/payment-options/router';
import revenuesRouter from './resources/revenues/router';
import spreadsheetsRouter from './resources/spreadsheets/router';

export default function routes(app: express.Application) {
    // Spreadsheets routes (auth + abstracts)
    app.use('/spreadsheets', spreadsheetsRouter);

    // Financial data routes
    app.use('/revenues', revenuesRouter);
    app.use('/expenses', expensesRouter);

    // Configuration routes
    app.use('/categories', categoriesRouter);
    app.use('/payment-options', paymentOptionsRouter);

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
}
