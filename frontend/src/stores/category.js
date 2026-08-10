import { defineStore } from 'pinia';
import api from '../services/api';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    expenseCategories: [],
    budgetCategories: [],
  }),
  actions: {
    async fetchExpenseCategories() {
      const res = await api.get('/expense-categories');
      this.expenseCategories = res.data;
    },
    async fetchBudgetCategories() {
      const res = await api.get('/budget-categories');
      this.budgetCategories = res.data;
    },
    async createExpenseCategory(payload) {
      const res = await api.post('/expense-categories', payload);
      await this.fetchExpenseCategories();
      return res.data;
    },
    async updateExpenseCategory(id, payload) {
      const res = await api.put(`/expense-categories/${id}`, payload);
      await this.fetchExpenseCategories();
      return res.data;
    },
    async removeExpenseCategory(id) {
      await api.delete(`/expense-categories/${id}`);
      await this.fetchExpenseCategories();
    },
    async createBudgetCategory(payload) {
      const res = await api.post('/budget-categories', payload);
      await this.fetchBudgetCategories();
      return res.data;
    },
    async updateBudgetCategory(id, payload) {
      const res = await api.put(`/budget-categories/${id}`, payload);
      await this.fetchBudgetCategories();
      return res.data;
    },
    async removeBudgetCategory(id) {
      await api.delete(`/budget-categories/${id}`);
      await this.fetchBudgetCategories();
    },
  },
});
