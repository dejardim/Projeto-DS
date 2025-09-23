import { CustomError } from '@utils/custom-error';
import type {
    NextFunction,
    Request,
    Response,
} from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import * as chatServices from './services';

export async function completions(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(JSON.stringify(errors.array()), 422));
    }

    const { message } = req.body;

    try {
        const result = await chatServices.completions({ message });
        res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
}
