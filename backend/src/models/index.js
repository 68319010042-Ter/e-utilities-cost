const sequelize = require('../config/db');
const User = require('./user.model');
const ExpenseCategory = require('./expenseCategory.model');
const BudgetCategory = require('./budgetCategory.model');
const Expense = require('./expense.model'); // also sets up associations

module.exports = {
  sequelize,
  User,
  ExpenseCategory,
  BudgetCategory,
  Expense,
};
