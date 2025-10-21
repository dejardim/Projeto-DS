import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { CategoriesService } from './services';

const categoriesService = new CategoriesService();

export const validateCreateCategory = [
    body('name').notEmpty().withMessage('Name is required'),
];

export const validateUpdateCategory = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
];

export const validateCategoryParams = [
    param('categoryUid').notEmpty().withMessage('Category ID is required'),
];

export class CategoriesController {
    async create(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const spreadsheetUid = (req as any).user.uid;
            const result = await categoriesService.create(
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
            const result = await categoriesService.getAll(spreadsheetUid);
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
            const { categoryUid } = req.params;

            const result = await categoriesService.getById(
                spreadsheetUid,
                categoryUid,
            );

            if (!result) {
                return res.status(404).json({ error: 'Category not found' });
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
            const { categoryUid } = req.params;

            const result = await categoriesService.update(
                spreadsheetUid,
                categoryUid,
                req.body,
            );

            if (!result) {
                return res.status(404).json({ error: 'Category not found' });
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
            const { categoryUid } = req.params;

            const result = await categoriesService.delete(
                spreadsheetUid,
                categoryUid,
            );

            if (!result) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
