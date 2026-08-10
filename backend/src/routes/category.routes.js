const express = require('express');
const router = express.Router();
const expenseCategoryController = require('../controllers/expenseCategory.controller');
const budgetCategoryController = require('../controllers/budgetCategory.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Expense categories
router.get('/expense-categories', expenseCategoryController.list);
router.post('/expense-categories', expenseCategoryController.create);
router.put('/expense-categories/:id', expenseCategoryController.update);
router.delete('/expense-categories/:id', expenseCategoryController.remove);

// Budget categories
router.get('/budget-categories', budgetCategoryController.list);
router.post('/budget-categories', budgetCategoryController.create);
router.put('/budget-categories/:id', budgetCategoryController.update);
router.delete('/budget-categories/:id', budgetCategoryController.remove);

module.exports = router;
