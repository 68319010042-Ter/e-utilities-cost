<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10">
    <router-link
      v-for="item in menu"
      :key="item.name"
      :to="item.to"
      class="flex flex-col items-center text-xs text-slate-500"
      active-class="text-slate-900 font-semibold"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { computed } from 'vue';

const auth = useAuthStore();

const menu = computed(() => {
  const items = [
    { name: 'shop', label: 'ร้านค้า', to: '/shop' },
    { name: 'cart', label: 'ตะกร้า', to: '/cart' },
    { name: 'orders', label: 'คำสั่งซื้อ', to: '/orders' },
  ];
  if (auth.user?.role === 'admin') {
    items.push({ name: 'product-manage', label: 'จัดการ', to: '/settings/products' });
  }
  return items;
});
</script>