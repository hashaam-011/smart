import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['Admin']), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticate, authorize(['Admin']), updateProduct);
router.delete('/:id', authenticate, authorize(['Admin']), deleteProduct);

export default router;