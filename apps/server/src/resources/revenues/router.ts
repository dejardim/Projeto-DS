import { Router } from 'express';
import { 
  RevenuesController, 
  validateCreateRevenue, 
  validateUpdateRevenue,
  validateRevenueParams,
  validateQueryParams
} from './controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const controller = new RevenuesController();

// All routes are protected
router.use(authMiddleware);

router.post('/', validateCreateRevenue, controller.create.bind(controller));
router.get('/', validateQueryParams, controller.getAll.bind(controller));
router.get('/:revenueUid', validateRevenueParams, controller.getById.bind(controller));
router.put('/:revenueUid', validateRevenueParams, validateUpdateRevenue, controller.update.bind(controller));
router.delete('/:revenueUid', validateRevenueParams, controller.delete.bind(controller));

export default router;
