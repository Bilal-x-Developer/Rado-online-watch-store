import { Router } from 'express';
import { createOrder, listOrders, updateOrderStatus } from './orderController.js';

const router = Router();

router.post('/orders', createOrder);
router.get('/orders', listOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;

