import type { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    type ValidatedRequest,
    withValidation,
} from '../../utils/request-handler';
import { NumoChatService } from './services';

const numoChatService = new NumoChatService();

export const validateNumoChatCommand = [
    body('command')
        .notEmpty()
        .withMessage('Command is required')
        .isString()
        .withMessage('Command must be a string'),
];

export class NumoChatController {
    processCommand = withValidation(
        async (
            req: Request,
            res: Response,
            { spreadsheetUid }: ValidatedRequest,
        ) => {
            const result = await numoChatService.processCommand(
                spreadsheetUid,
                req.body,
            );

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        },
    );
}
