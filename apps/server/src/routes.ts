import type express from 'express';
import spreadsheetsRouter from './resources/spreadsheets/router';
import revenuesRouter from './resources/revenues/router';
import expensesRouter from './resources/expenses/router';
import categoriesRouter from './resources/categories/router';
import paymentOptionsRouter from './resources/payment-options/router';

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
