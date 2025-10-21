import { Router } from 'express';
import { 
  CategoriesController, 
  validateCreateCategory, 
  validateUpdateCategory,
  validateCategoryParams
} from './controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const controller = new CategoriesController();

// All routes are protected
router.use(authMiddleware);

router.post('/', validateCreateCategory, controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:categoryUid', validateCategoryParams, controller.getById.bind(controller));
router.put('/:categoryUid', validateCategoryParams, validateUpdateCategory, controller.update.bind(controller));
router.delete('/:categoryUid', validateCategoryParams, controller.delete.bind(controller));

export default router;
