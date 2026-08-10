<template>
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <h2 class="text-lg font-bold mb-3">ประเภทค่าใช้จ่าย</h2>
      <form class="flex gap-2 mb-3" @submit.prevent="addExpenseCategory">
        <input v-model="newExpenseCategory.name" placeholder="ชื่อ" class="border rounded px-2 py-1 flex-1" required />
        <input v-model="newExpenseCategory.code" placeholder="รหัส" class="border rounded px-2 py-1 w-24" required />
        <button class="bg-slate-900 text-white px-3 py-1 rounded">เพิ่ม</button>
      </form>
      <ul class="bg-white rounded-lg shadow divide-y">
        <li v-for="c in categoryStore.expenseCategories" :key="c.id" class="p-3 flex justify-between items-center">
          <span>{{ c.name }} <span class="text-xs text-slate-400">({{ c.code }})</span></span>
          <button class="text-red-600 text-sm" @click="categoryStore.removeExpenseCategory(c.id)">ลบ</button>
        </li>
      </ul>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-3">หมวดเงิน</h2>
      <form class="flex gap-2 mb-3" @submit.prevent="addBudgetCategory">
        <input v-model="newBudgetCategory.name" placeholder="ชื่อ" class="border rounded px-2 py-1 flex-1" required />
        <input v-model="newBudgetCategory.code" placeholder="รหัส" class="border rounded px-2 py-1 w-24" required />
        <button class="bg-slate-900 text-white px-3 py-1 rounded">เพิ่ม</button>
      </form>
      <ul class="bg-white rounded-lg shadow divide-y">
        <li v-for="c in categoryStore.budgetCategories" :key="c.id" class="p-3 flex justify-between items-center">
          <span>{{ c.name }} <span class="text-xs text-slate-400">({{ c.code }})</span></span>
          <button class="text-red-600 text-sm" @click="categoryStore.removeBudgetCategory(c.id)">ลบ</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useCategoryStore } from '../stores/category';

const categoryStore = useCategoryStore();

const newExpenseCategory = reactive({ name: '', code: '' });
const newBudgetCategory = reactive({ name: '', code: '' });

async function addExpenseCategory() {
  await categoryStore.createExpenseCategory({ ...newExpenseCategory });
  newExpenseCategory.name = '';
  newExpenseCategory.code = '';
}

async function addBudgetCategory() {
  await categoryStore.createBudgetCategory({ ...newBudgetCategory });
  newBudgetCategory.name = '';
  newBudgetCategory.code = '';
}

onMounted(() => {
  categoryStore.fetchExpenseCategories();
  categoryStore.fetchBudgetCategories();
});
</script>
