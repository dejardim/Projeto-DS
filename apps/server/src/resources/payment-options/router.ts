import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    PaymentOptionsController,
    validateCreatePaymentOption,
    validatePaymentOptionParams,
    validateUpdatePaymentOption,
} from './controller';

const router = Router();
const controller = new PaymentOptionsController();

// All routes are protected
router.use(authMiddleware);

router.post(
    '/',
    validateCreatePaymentOption,
    controller.create.bind(controller),
);
router.get('/', controller.getAll.bind(controller));
router.get(
    '/:paymentOptionUid',
    validatePaymentOptionParams,
    controller.getById.bind(controller),
);
router.put(
    '/:paymentOptionUid',
    validatePaymentOptionParams,
    validateUpdatePaymentOption,
    controller.update.bind(controller),
);
router.delete(
    '/:paymentOptionUid',
    validatePaymentOptionParams,
    controller.delete.bind(controller),
);

export default router;
