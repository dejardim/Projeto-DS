import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    ExpensesController,
    validateCreateExpense,
    validateExpenseParams,
    validateQueryParams,
    validateUpdateExpense,
} from './controller';

const router = Router();
const controller = new ExpensesController();

// All routes are protected
router.use(authMiddleware);

router.post('/', validateCreateExpense, controller.create.bind(controller));
router.get('/', validateQueryParams, controller.getAll.bind(controller));
router.get(
    '/category/:category',
    validateQueryParams,
    controller.getByCategory.bind(controller),
);
router.get(
    '/:expenseUid',
    validateExpenseParams,
    controller.getById.bind(controller),
);
router.put(
    '/:expenseUid',
    validateExpenseParams,
    validateUpdateExpense,
    controller.update.bind(controller),
);
router.delete(
    '/:expenseUid',
    validateExpenseParams,
    controller.delete.bind(controller),
);

export default router;
