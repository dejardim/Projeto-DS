import type { CustomError } from '@utils/custom-error';

import type {
    NextFunction,
    Request,
    Response,
} from 'express-serve-static-core';

export function error(
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    try {
        const message = JSON.parse(err.message);
        res.status(err.status || 500).json({ success: false, result: message });
    } catch {
        res.status(err.status || 500).json({
            success: false,
            result: err.message,
        });
    }
}
