const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const ExpenseCategory = require('./expenseCategory.model');
const BudgetCategory = require('./budgetCategory.model');

const Expense = sequelize.define(
  'Expense',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    expense_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    budget_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    billing_month: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    paid_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    invoice_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachment_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'expenses',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
Expense.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id', as: 'expenseCategory' });
Expense.belongsTo(BudgetCategory, { foreignKey: 'budget_category_id', as: 'budgetCategory' });
Expense.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

ExpenseCategory.hasMany(Expense, { foreignKey: 'expense_category_id', as: 'expenses' });
BudgetCategory.hasMany(Expense, { foreignKey: 'budget_category_id', as: 'expenses' });
User.hasMany(Expense, { foreignKey: 'created_by', as: 'expenses' });

module.exports = Expense;
