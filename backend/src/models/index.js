const sequelize = require('../config/db');
const User = require('./user.model');
const ExpenseCategory = require('./expenseCategory.model');
const BudgetCategory = require('./budgetCategory.model');
const Expense = require('./expense.model');
const Product = require('./product.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model'); // also sets up associations

module.exports = {
  sequelize,
  User,
  ExpenseCategory,
  BudgetCategory,
  Expense,
  Product,
  Order,
  OrderItem,
};