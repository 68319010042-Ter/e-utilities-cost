<template>
  <aside
    class="w-56 min-h-screen p-4 flex flex-col"
    :style="{ backgroundColor: 'var(--color-sidebar)', color: 'var(--color-sidebar-text)' }"
  >
    <h1 class="text-lg font-bold mb-6">BB Gun Parts Shop</h1>
    <nav class="flex flex-col gap-1">
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.to"
        class="px-3 py-2 rounded transition"
        :class="{ 'font-semibold': route.path === item.to }"
        :style="route.path === item.to
          ? { backgroundColor: 'var(--color-sidebar-hover)' }
          : {}"
        @mouseenter="hoverStyles[item.name] = true"
        @mouseleave="hoverStyles[item.name] = false"
      >
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const hoverStyles = reactive({});

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

<style scoped>
a:hover {
  background-color: var(--color-sidebar-hover);
}
</style>