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
const menu = [
  { name: 'dashboard', label: 'แดชบอร์ด', to: '/' },
  { name: 'expenses', label: 'รายการ', to: '/expenses' },
  { name: 'categories', label: 'หมวดหมู่', to: '/settings/categories' },
  { name: 'reports', label: 'รายงาน', to: '/reports' },
];
</script>
