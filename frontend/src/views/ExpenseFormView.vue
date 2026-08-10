<template>
  <div class="max-w-lg">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'แก้ไขรายการค่าใช้จ่าย' : 'เพิ่มรายการค่าใช้จ่าย' }}</h2>

    <form class="bg-white rounded-lg shadow p-6 flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm mb-1">ประเภทค่าใช้จ่าย</label>
        <select v-model.number="form.expense_category_id" class="w-full border rounded px-3 py-2" required>
          <option v-for="c in categoryStore.expenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm mb-1">หมวดเงินที่เบิก</label>
        <select v-model.number="form.budget_category_id" class="w-full border rounded px-3 py-2" required>
          <option v-for="c in categoryStore.budgetCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm mb-1">จำนวนเงิน (บาท)</label>
        <input v-model.number="form.amount" type="number" step="0.01" class="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block text-sm mb-1">เดือน/ปีของบิล</label>
        <input v-model="form.billing_month" type="date" class="w-full border rounded px-3 py-2" required />
      </div>

      <div>
        <label class="block text-sm mb-1">วันที่ชำระจริง</label>
        <input v-model="form.paid_date" type="date" class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm mb-1">เลขที่ใบแจ้งหนี้</label>
        <input v-model="form.invoice_no" type="text" class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm mb-1">หมายเหตุ</label>
        <textarea v-model="form.note" class="w-full border rounded px-3 py-2" rows="3"></textarea>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700">
          บันทึก
        </button>
        <router-link to="/expenses" class="px-4 py-2 rounded border">ยกเลิก</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExpenseStore } from '../stores/expense';
import { useCategoryStore } from '../stores/category';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const store = useExpenseStore();
const categoryStore = useCategoryStore();

const isEdit = !!route.params.id;

const form = reactive({
  expense_category_id: null,
  budget_category_id: null,
  amount: null,
  billing_month: '',
  paid_date: '',
  invoice_no: '',
  note: '',
});

async function loadExisting() {
  if (!isEdit) return;
  const res = await api.get(`/expenses/${route.params.id}`);
  Object.assign(form, {
    expense_category_id: res.data.expense_category_id,
    budget_category_id: res.data.budget_category_id,
    amount: res.data.amount,
    billing_month: res.data.billing_month,
    paid_date: res.data.paid_date,
    invoice_no: res.data.invoice_no,
    note: res.data.note,
  });
}

async function handleSubmit() {
  if (isEdit) {
    await store.update(route.params.id, form);
  } else {
    await store.create(form);
  }
  router.push({ name: 'expenses' });
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchExpenseCategories(),
    categoryStore.fetchBudgetCategories(),
  ]);
  await loadExisting();
});
</script>
