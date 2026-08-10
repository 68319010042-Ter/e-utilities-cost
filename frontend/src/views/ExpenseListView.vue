<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">รายการค่าใช้จ่าย</h2>
      <router-link
        to="/expenses/create"
        class="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700"
      >
        + เพิ่มรายการ
      </router-link>
    </div>

    <div class="flex gap-2 mb-4">
      <select v-model.number="filters.year" class="border rounded px-2 py-1" @change="load">
        <option :value="null">ทุกปี</option>
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <select v-model.number="filters.month" class="border rounded px-2 py-1" @change="load">
        <option :value="null">ทุกเดือน</option>
        <option v-for="m in 12" :key="m" :value="m">เดือน {{ m }}</option>
      </select>
    </div>

    <!-- Desktop table -->
    <table class="w-full bg-white rounded-lg shadow hidden md:table">
      <thead>
        <tr class="text-left text-sm text-slate-500 border-b">
          <th class="p-3">เดือน/ปี</th>
          <th class="p-3">ประเภท</th>
          <th class="p-3">หมวดเงิน</th>
          <th class="p-3">จำนวนเงิน</th>
          <th class="p-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.items" :key="item.id" class="border-b hover:bg-slate-50">
          <td class="p-3">{{ item.billing_month }}</td>
          <td class="p-3">{{ item.expenseCategory?.name }}</td>
          <td class="p-3">{{ item.budgetCategory?.name }}</td>
          <td class="p-3">{{ formatCurrency(item.amount) }}</td>
          <td class="p-3 text-right">
            <router-link :to="`/expenses/${item.id}/edit`" class="text-blue-600 mr-2">แก้ไข</router-link>
            <button class="text-red-600" @click="handleDelete(item.id)">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile card list -->
    <div class="md:hidden flex flex-col gap-2">
      <div v-for="item in store.items" :key="item.id" class="bg-white rounded-lg shadow p-3">
        <div class="flex justify-between">
          <span class="font-medium">{{ item.expenseCategory?.name }}</span>
          <span>{{ formatCurrency(item.amount) }}</span>
        </div>
        <div class="text-sm text-slate-500">{{ item.billing_month }} · {{ item.budgetCategory?.name }}</div>
        <div class="mt-2 flex gap-3 text-sm">
          <router-link :to="`/expenses/${item.id}/edit`" class="text-blue-600">แก้ไข</router-link>
          <button class="text-red-600" @click="handleDelete(item.id)">ลบ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useExpenseStore } from '../stores/expense';

const store = useExpenseStore();
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const filters = reactive({ year: currentYear, month: null });

function formatCurrency(v) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
}

async function load() {
  const params = {};
  if (filters.year) params.year = filters.year;
  if (filters.month) params.month = filters.month;
  await store.fetchList(params);
}

async function handleDelete(id) {
  if (!confirm('ยืนยันการลบรายการนี้?')) return;
  await store.remove(id);
  await load();
}

onMounted(load);
</script>
