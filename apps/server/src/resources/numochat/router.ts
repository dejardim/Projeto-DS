import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { NumoChatController, validateNumoChatCommand } from './controller';

const router = Router();
const controller = new NumoChatController();

// All routes are protected
router.use(authMiddleware);

// POST /api/numochat - Process a natural language command
router.post(
    '/',
    validateNumoChatCommand,
    controller.processCommand.bind(controller),
);

export default router;
