const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authMiddleware, requireAdmin } = require('../middlewares/auth.middleware');

// ดูสินค้า - ผู้ใช้ทั่วไปดูได้โดยไม่ต้อง login (สินค้าเปิดขายเท่านั้น)
router.get('/', productController.list);
router.get('/:id', productController.get);

// จัดการสินค้า - เฉพาะ admin
router.post('/', authMiddleware, requireAdmin, productController.create);
router.put('/:id', authMiddleware, requireAdmin, productController.update);
router.delete('/:id', authMiddleware, requireAdmin, productController.remove);

module.exports = router;