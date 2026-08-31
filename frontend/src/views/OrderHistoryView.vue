<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>

    <p v-if="loading" class="text-slate-500">กำลังโหลด...</p>
    <p v-else-if="orders.length === 0" class="text-slate-500">
      ยังไม่มีคำสั่งซื้อ
      <router-link :to="{ name: 'shop' }" class="underline ml-2" :style="{ color: 'var(--color-primary)' }">
        ไปเลือกซื้อสินค้า
      </router-link>
    </p>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border rounded-lg p-4 shadow-sm"
        :style="{ backgroundColor: 'var(--color-surface)' }"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="font-semibold">คำสั่งซื้อ #{{ order.id }}</p>
          <span class="text-sm px-2 py-1 rounded" :class="statusClass(order.status)">
            {{ statusLabel(order.status) }}
          </span>
        </div>
        <p class="text-sm text-slate-500 mb-2">
          {{ new Date(order.created_at).toLocaleString('th-TH') }}
        </p>
        <ul class="text-sm text-slate-700 mb-2">
          <li v-for="item in order.items" :key="item.id">
            {{ item.product?.name || 'สินค้าไม่พบ' }} x {{ item.quantity }} — {{ formatPrice(item.unit_price * item.quantity) }} บาท
          </li>
        </ul>
        <p class="font-bold text-right">รวม {{ formatPrice(order.total_amount) }} บาท</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);
const loading = ref(true);

function formatPrice(value) {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

const statusMap = {
  pending: { label: 'รอดำเนินการ', class: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'ชำระเงินแล้ว', class: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'จัดส่งแล้ว', class: 'bg-purple-100 text-purple-700' },
  completed: { label: 'สำเร็จ', class: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ยกเลิก', class: 'bg-red-100 text-red-700' },
};

function statusLabel(status) {
  return statusMap[status]?.label || status;
}
function statusClass(status) {
  return statusMap[status]?.class || 'bg-slate-100 text-slate-700';
}

onMounted(async () => {
  try {
    const res = await api.get('/orders');
    orders.value = res.data;
  } finally {
    loading.value = false;
  }
});
</script>