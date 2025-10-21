import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    SpreadsheetsController,
    validateAbstractParams,
    validateCreateAbstract,
    validateLogin,
    validateSignup,
    validateTransactionsQuery,
} from './controller';

const router = Router();
const controller = new SpreadsheetsController();

// Auth routes
router.post('/auth/signup', validateSignup, controller.signup.bind(controller));
router.post('/auth/login', validateLogin, controller.login.bind(controller));

// Abstract routes (protected)
router.post(
    '/abstracts',
    authMiddleware,
    validateCreateAbstract,
    controller.createAbstract.bind(controller),
);

router.get('/abstracts', authMiddleware, controller.getAllAbstracts.bind(controller));
router.get(
    '/abstracts/:mount/:year',
    authMiddleware,
    validateAbstractParams,
    controller.getAbstractWithAnalytics.bind(controller),
);
router.put(
    '/abstracts/:abstractUid/notes',
    authMiddleware,
    controller.updateAbstractNotes.bind(controller),
);

// Transactions route (protected)
router.get(
    '/transactions',
    authMiddleware,
    validateTransactionsQuery,
    controller.getRecentTransactions.bind(controller),
);

export default router;
