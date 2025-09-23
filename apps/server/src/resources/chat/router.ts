import { Router } from 'express';
import { body, checkExact } from 'express-validator';
import * as chatController from './controller';

const router = Router();

router.post(
    '/completions',
    [
        body('message')
            .isString()
            .withMessage('Message must be a string')
            .notEmpty()
            .withMessage('Message is required'),
        checkExact([], { message: 'Only the specified fields are allowed' }),
    ],
    chatController.completions,
);

export default router;
