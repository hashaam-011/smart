import { Router } from 'express';
import { getUserOrders, getAllOrders } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/my', authenticate, authorize(['Customer', 'Admin']), getUserOrders);
router.get('/all', authenticate, authorize(['Admin']), getAllOrders);

export default router;