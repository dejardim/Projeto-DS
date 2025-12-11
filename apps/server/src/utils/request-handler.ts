import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { handleControllerError } from './error-handler';

/**
 * Validated request data extracted from authenticated requests.
 */
export interface ValidatedRequest {
    spreadsheetUid: string;
}

/**
 * Type for controller handler functions that receive validated request data.
 * Allows returning Response (for early returns) or void.
 */
export type ControllerHandler = (
    req: Request,
    res: Response,
    validated: ValidatedRequest,
) => Promise<Response | void>;

/**
 * Higher-order function that wraps controller handlers with:
 * - Request validation (express-validator)
 * - Authentication verification
 * - Centralized error handling
 *
 * This eliminates duplicate code across all controller methods.
 */
export function withValidation(handler: ControllerHandler) {
    return async (req: Request, res: Response) => {
        try {
            // Centralized validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Centralized authentication check
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const validated: ValidatedRequest = {
                spreadsheetUid: req.user.uid,
            };

            await handler(req, res, validated);
        } catch (error) {
            handleControllerError(error, res, handler.name || 'anonymous');
        }
    };
}

/**
 * Simplified version without validation for routes that don't need it.
 */
export function withAuth(handler: ControllerHandler) {
    return async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const validated: ValidatedRequest = {
                spreadsheetUid: req.user.uid,
            };

            await handler(req, res, validated);
        } catch (error) {
            handleControllerError(error, res, handler.name || 'anonymous');
        }
    };
}
