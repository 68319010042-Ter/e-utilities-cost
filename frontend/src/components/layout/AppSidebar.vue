<template>
  <aside class="w-56 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col">
    <h1 class="text-lg font-bold mb-6">BB Gun Parts Shop</h1>
    <nav class="flex flex-col gap-1">
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.to"
        class="px-3 py-2 rounded hover:bg-slate-700 transition"
        active-class="bg-slate-700"
      >
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { computed } from 'vue';

const auth = useAuthStore();

const menu = computed(() => {
  const items = [
    { name: 'shop', label: 'หน้าร้าน', to: '/shop' },
    { name: 'cart', label: 'ตะกร้าสินค้า', to: '/cart' },
    { name: 'orders', label: 'คำสั่งซื้อของฉัน', to: '/orders' },
  ];
  if (auth.user?.role === 'admin') {
    items.push({ name: 'product-manage', label: 'จัดการสินค้า', to: '/settings/products' });
  }
  return items;
});
</script>