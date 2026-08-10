<template>
  <aside class="w-56 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col">
    <h1 class="text-lg font-bold mb-6">ค่าสาธารณูปโภค</h1>
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
const menu = [
  { name: 'dashboard', label: 'แดชบอร์ด', to: '/' },
  { name: 'expenses', label: 'รายการค่าใช้จ่าย', to: '/expenses' },
  { name: 'categories', label: 'จัดการหมวดหมู่', to: '/settings/categories' },
  { name: 'reports', label: 'รายงานย้อนหลัง', to: '/reports' },
];
</script>
