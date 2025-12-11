import type { Response } from 'express';
import { logger } from '../config/logger';

/**
 * Handles controller errors with proper logging and standardized response.
 * Centralizes error handling to avoid duplicate code and silent failures.
 */
export function handleControllerError(
    error: unknown,
    res: Response,
    context: string,
): void {
    // Log the error for observability
    logger.error({ err: error, context }, 'Controller error occurred');

    // Return standardized error response
    res.status(500).json({ error: 'Internal server error' });
}
