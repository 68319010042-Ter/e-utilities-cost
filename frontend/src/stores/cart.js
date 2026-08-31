import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // [{ product_id, name, price, quantity, image_path }]
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalAmount: (state) =>
      state.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
  },
  actions: {
    addItem(product, quantity = 1) {
      const existing = this.items.find((i) => i.product_id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_path: product.image_path,
          quantity,
        });
      }
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find((i) => i.product_id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    removeItem(productId) {
      this.items = this.items.filter((i) => i.product_id !== productId);
    },
    clear() {
      this.items = [];
    },
  },
});