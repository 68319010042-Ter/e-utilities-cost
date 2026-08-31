const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authMiddleware, requireAdmin } = require('../middlewares/auth.middleware');

// ต้อง login ก่อนถึงจะสั่งซื้อ/ดูคำสั่งซื้อได้
router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.list);
router.get('/:id', authMiddleware, orderController.get);
router.patch('/:id/status', authMiddleware, requireAdmin, orderController.updateStatus);

module.exports = router;