import type { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { SpreadsheetsService } from './services';

const spreadsheetsService = new SpreadsheetsService();

export const validateSignup = [
    body('name').notEmpty().withMessage('Name is required'),
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
];

export const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const validateCreateAbstract = [
    body('name').notEmpty().withMessage('Name is required'),
    body('mount')
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    body('year').isInt({ min: 2000 }).withMessage('Year must be valid'),
    body('budgets.revenue.planned')
        .isNumeric()
        .withMessage('Revenue planned must be a number'),
    body('budgets.expenses').isArray().withMessage('Expenses must be an array'),
];

export const validateAbstractParams = [
    param('mount')
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    param('year').isInt({ min: 2000 }).withMessage('Year must be valid'),
];

export const validateTransactionsQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

export class SpreadsheetsController {
    async signup(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await spreadsheetsService.signup(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            if (
                error instanceof Error &&
                error.message.includes('UNIQUE constraint failed')
            ) {
                return res
                    .status(409)
                    .json({ error: 'Username already exists' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await spreadsheetsService.login(req.body);
            res.json(result);
        } catch (error) {
            console.log(error);
            if (
                error instanceof Error &&
                error.message === 'Invalid credentials'
            ) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createAbstract(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const spreadsheetUid = req.user.uid;
            const result = await spreadsheetsService.createAbstract(
                spreadsheetUid,
                req.body,
            );
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            if (
                error instanceof Error &&
                error.message.includes('already exists')
            ) {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllAbstracts(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const spreadsheetUid = req.user.uid;
            const result = await spreadsheetsService.getAllAbstracts(spreadsheetUid);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAbstractWithAnalytics(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const spreadsheetUid = req.user.uid;
            const { mount, year } = req.params;

            const result = await spreadsheetsService.getAbstractWithAnalytics(
                spreadsheetUid,
                parseInt(mount),
                parseInt(year),
            );

            res.json(result);
        } catch (error) {
            console.log(error);
            if (
                error instanceof Error &&
                error.message === 'Abstract not found'
            ) {
                return res.status(404).json({ error: 'Abstract not found' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateAbstractNotes(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const spreadsheetUid = req.user.uid;
            const { abstractUid } = req.params;
            const { notes } = req.body;

            const result = await spreadsheetsService.updateAbstractNotes(
                spreadsheetUid,
                abstractUid,
                notes,
            );

            if (!result) {
                return res.status(404).json({ error: 'Abstract not found' });
            }

            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getRecentTransactions(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const spreadsheetUid = req.user.uid;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 25;

            const result = await spreadsheetsService.getRecentTransactions(
                spreadsheetUid,
                page,
                limit,
            );

            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
