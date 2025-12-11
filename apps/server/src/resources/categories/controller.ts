import type { Request, Response } from 'express';
import { body, param } from 'express-validator';
import {
    type ValidatedRequest,
    withAuth,
    withValidation,
} from '../../utils/request-handler';
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
    create = withValidation(
        async (
            req: Request,
            res: Response,
            { spreadsheetUid }: ValidatedRequest,
        ) => {
            const result = await categoriesService.create(
                spreadsheetUid,
                req.body,
            );
            res.status(201).json(result);
        },
    );

    getAll = withAuth(
        async (
            _req: Request,
            res: Response,
            { spreadsheetUid }: ValidatedRequest,
        ) => {
            const result = await categoriesService.getAll(spreadsheetUid);
            res.json(result);
        },
    );

    getById = withValidation(
        async (
            req: Request,
            res: Response,
            { spreadsheetUid }: ValidatedRequest,
        ) => {
            const { categoryUid } = req.params;

            const result = await categoriesService.getById(
                spreadsheetUid,
                categoryUid,
            );

            if (!result) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(result);
        },
    );

    update = withValidation(
        async (
            req: Request,
            res: Response,
            { spreadsheetUid }: ValidatedRequest,
        ) => {
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
        },
    );

    delete = withValidation(
        async (
            req: Request,
            res: Response,
            { spreadsheetUid }: ValidatedRequest,
        ) => {
            const { categoryUid } = req.params;

            const result = await categoriesService.delete(
                spreadsheetUid,
                categoryUid,
            );

            if (!result) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json({ message: 'Category deleted successfully' });
        },
    );
}
