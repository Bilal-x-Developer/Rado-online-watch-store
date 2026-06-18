import { Router } from 'express';
import { listProducts, createProduct, deleteProduct, updateProduct } from './productController.js';

const router = Router();

router.get('/products', listProducts);
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id', updateProduct);

export default router;
