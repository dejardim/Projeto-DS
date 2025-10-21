import type { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { RevenuesService } from './services';

const revenuesService = new RevenuesService();

export const validateCreateRevenue = [
    body('month')
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    body('year').isInt({ min: 2000 }).withMessage('Year must be valid'),
    body('date')
        .isInt({ min: 1, max: 31 })
        .withMessage('Date must be between 1 and 31'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('paymentOption').optional().isString(),
];

export const validateUpdateRevenue = [
    body('month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    body('year')
        .optional()
        .isInt({ min: 2000 })
        .withMessage('Year must be valid'),
    body('date')
        .optional()
        .isInt({ min: 1, max: 31 })
        .withMessage('Date must be between 1 and 31'),
    body('amount')
        .optional()
        .isNumeric()
        .withMessage('Amount must be a number'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Description cannot be empty'),
    body('paymentOption').optional().isString(),
];

export const validateRevenueParams = [
    param('revenueUid').notEmpty().withMessage('Revenue ID is required'),
];

export const validateQueryParams = [
    query('month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    query('year')
        .optional()
        .isInt({ min: 2000 })
        .withMessage('Year must be valid'),
];

export class RevenuesController {
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const result = await revenuesService.create(
                spreadsheetUid,
                req.body,
            );
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const { month, year } = req.query;

            const result = await revenuesService.getAll(
                spreadsheetUid,
                month ? parseInt(month as string) : undefined,
                year ? parseInt(year as string) : undefined,
            );

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const { revenueUid } = req.params;

            const result = await revenuesService.getById(
                spreadsheetUid,
                revenueUid,
            );

            if (!result) {
                return res.status(404).json({ error: 'Revenue not found' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const { revenueUid } = req.params;

            const result = await revenuesService.update(
                spreadsheetUid,
                revenueUid,
                req.body,
            );

            if (!result) {
                return res.status(404).json({ error: 'Revenue not found' });
            }

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const { revenueUid } = req.params;

            const result = await revenuesService.delete(
                spreadsheetUid,
                revenueUid,
            );

            if (!result) {
                return res.status(404).json({ error: 'Revenue not found' });
            }

            res.json({ message: 'Revenue deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
