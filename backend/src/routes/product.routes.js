const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');
const { authMiddleware, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', productController.list);
router.get('/:id', productController.get);

router.post(
  '/upload',
  authMiddleware,
  requireAdmin,
  upload.single('image'),
  productController.uploadImage
);

router.post('/', authMiddleware, requireAdmin, productController.create);
router.put('/:id', authMiddleware, requireAdmin, productController.update);
router.delete('/:id', authMiddleware, requireAdmin, productController.remove);

module.exports = router;