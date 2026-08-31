<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">
      {{ isAdmin ? 'จัดการคำสั่งซื้อทั้งหมด' : 'คำสั่งซื้อของฉัน' }}
    </h1>

    <p v-if="loading" class="text-slate-500">กำลังโหลด...</p>
    <p v-else-if="orders.length === 0" class="text-slate-500">
      ยังไม่มีคำสั่งซื้อ
      <router-link :to="{ name: 'shop' }" class="underline ml-2" :style="{ color: 'var(--color-primary)' }">
        ไปเลือกซื้อสินค้า
      </router-link>
    </p>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="border rounded-xl p-4 card-surface">
        <div class="flex items-center justify-between mb-2">
          <p class="font-semibold">คำสั่งซื้อ #{{ order.id }}</p>

          <div class="flex items-center gap-2">
            <select
              v-if="isAdmin"
              class="text-sm border rounded px-2 py-1"
              :value="order.status"
              @change="updateStatus(order, $event.target.value)"
            >
              <option v-for="(v, key) in statusMap" :key="key" :value="key">{{ v.label }}</option>
            </select>
            <span v-else class="text-sm px-2 py-1 rounded" :class="statusClass(order.status)">
              {{ statusLabel(order.status) }}
            </span>

            <button
              v-if="isAdmin"
              class="text-red-600 hover:underline text-sm"
              @click="deleteOrder(order.id)"
            >
              ลบ
            </button>
          </div>
        </div>

        <p class="text-sm text-slate-500 mb-2">
          {{ new Date(order.created_at).toLocaleString('th-TH') }}
          <span v-if="isAdmin && order.user"> — {{ order.user.full_name || order.user.username }}</span>
        </p>

        <ul class="text-sm text-slate-700 mb-2">
          <li v-for="item in order.items" :key="item.id">
            {{ item.product?.name || 'สินค้าไม่พบ' }} x {{ item.quantity }} — {{ formatPrice(item.unit_price * item.quantity) }} บาท
          </li>
        </ul>
        <p class="font-bold text-right">รวม {{ formatPrice(order.total_amount) }} บาท</p>

        <p v-if="orderError[order.id]" class="text-red-600 text-sm mt-2">{{ orderError[order.id] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';

const orders = ref([]);
const loading = ref(true);
const orderError = reactive({});

const auth = useAuthStore();
const isAdmin = computed(() => auth.user?.role === 'admin');

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

async function loadOrders() {
  loading.value = true;
  try {
    const res = await api.get('/orders');
    orders.value = res.data;
  } finally {
    loading.value = false;
  }
}

async function updateStatus(order, newStatus) {
  orderError[order.id] = '';
  const prevStatus = order.status;
  order.status = newStatus;
  try {
    await api.patch(`/orders/${order.id}/status`, { status: newStatus });
  } catch (err) {
    order.status = prevStatus;
    orderError[order.id] = err.response?.data?.message || 'อัปเดตสถานะไม่สำเร็จ';
  }
}

async function deleteOrder(id) {
  if (!confirm('ยืนยันการลบคำสั่งซื้อนี้? การลบไม่สามารถย้อนกลับได้')) return;
  try {
    await api.delete(`/orders/${id}`);
    orders.value = orders.value.filter((o) => o.id !== id);
  } catch (err) {
    orderError[id] = err.response?.data?.message || 'ลบไม่สำเร็จ';
  }
}

onMounted(loadOrders);
</script>