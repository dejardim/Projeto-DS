import { CustomError } from '@utils/custom-error';

import type {
    NextFunction,
    Request,
    Response,
} from 'express-serve-static-core';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
    return next(new CustomError('Route not found', 404));
}
