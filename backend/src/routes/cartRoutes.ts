import { Router } from 'express';
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  checkout,
} from '../controllers/cartController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/add', authenticate, authorize(['Customer']), addToCart);
router.put('/update', authenticate, authorize(['Customer']), updateCartQuantity);
router.delete('/remove', authenticate, authorize(['Customer']), removeFromCart);
router.post('/checkout', authenticate, authorize(['Customer']), checkout);

export default router;