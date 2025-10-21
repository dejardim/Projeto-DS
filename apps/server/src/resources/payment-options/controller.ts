import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { PaymentOptionsService } from './services';

const paymentOptionsService = new PaymentOptionsService();

export const validateCreatePaymentOption = [
    body('name').notEmpty().withMessage('Name is required'),
];

export const validateUpdatePaymentOption = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
];

export const validatePaymentOptionParams = [
    param('paymentOptionUid')
        .notEmpty()
        .withMessage('Payment Option ID is required'),
];

export class PaymentOptionsController {
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const result = await paymentOptionsService.create(
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
            const spreadsheetUid = (req as any).user.uid;
            const result = await paymentOptionsService.getAll(spreadsheetUid);
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
            const { paymentOptionUid } = req.params;

            const result = await paymentOptionsService.getById(
                spreadsheetUid,
                paymentOptionUid,
            );

            if (!result) {
                return res
                    .status(404)
                    .json({ error: 'Payment option not found' });
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
            const { paymentOptionUid } = req.params;

            const result = await paymentOptionsService.update(
                spreadsheetUid,
                paymentOptionUid,
                req.body,
            );

            if (!result) {
                return res
                    .status(404)
                    .json({ error: 'Payment option not found' });
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
            const { paymentOptionUid } = req.params;

            const result = await paymentOptionsService.delete(
                spreadsheetUid,
                paymentOptionUid,
            );

            if (!result) {
                return res
                    .status(404)
                    .json({ error: 'Payment option not found' });
            }

            res.json({ message: 'Payment option deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
