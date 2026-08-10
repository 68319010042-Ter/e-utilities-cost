import { defineStore } from 'pinia';
import api from '../services/api';

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    loading: false,
  }),
  actions: {
    async fetchList(params = {}) {
      this.loading = true;
      try {
        const res = await api.get('/expenses', { params });
        this.items = res.data.data;
        this.total = res.data.total;
        this.page = res.data.page;
        this.limit = res.data.limit;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const res = await api.post('/expenses', payload);
      return res.data;
    },
    async update(id, payload) {
      const res = await api.put(`/expenses/${id}`, payload);
      return res.data;
    },
    async remove(id) {
      await api.delete(`/expenses/${id}`);
    },
  },
});
