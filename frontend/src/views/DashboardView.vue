<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">แดชบอร์ด</h2>
      <select v-model.number="year" class="border rounded px-2 py-1" @change="loadData">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-slate-500">ยอดรวมเดือนนี้</p>
        <p class="text-2xl font-bold">{{ formatCurrency(currentMonthTotal) }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-slate-500">ยอดรวมเดือนก่อน</p>
        <p class="text-2xl font-bold">{{ formatCurrency(previousMonthTotal) }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-slate-500">เปลี่ยนแปลง</p>
        <p class="text-2xl font-bold" :class="changePercent >= 0 ? 'text-red-600' : 'text-green-600'">
          {{ changePercent >= 0 ? '+' : '' }}{{ changePercent.toFixed(1) }}%
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-sm text-slate-500">ยอดรวมปีนี้</p>
        <p class="text-2xl font-bold">{{ formatCurrency(yearTotal) }}</p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">ยอดรายเดือน</h3>
        <Bar v-if="monthlyChartData" :data="monthlyChartData" :options="chartOptions" />
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-2">สัดส่วนตามประเภทค่าใช้จ่าย</h3>
        <Pie v-if="categoryChartData" :data="categoryChartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const currentYear = new Date().getFullYear();
const year = ref(currentYear);
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const summary = ref(null);
const byCategory = ref([]);

const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };

const monthlyChartData = computed(() => {
  if (!summary.value) return null;
  return {
    labels: summary.value.monthly.map((m) => `เดือน ${m.month}`),
    datasets: [
      {
        label: 'ยอดรวม (บาท)',
        backgroundColor: '#0f172a',
        data: summary.value.monthly.map((m) => m.total),
      },
    ],
  };
});

const categoryChartData = computed(() => {
  if (!byCategory.value.length) return null;
  return {
    labels: byCategory.value.map((c) => c.name),
    datasets: [
      {
        backgroundColor: ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#22c55e', '#f59e0b'],
        data: byCategory.value.map((c) => c.total),
      },
    ],
  };
});

const yearTotal = computed(() => summary.value?.yearTotal || 0);
const currentMonthTotal = computed(() => {
  if (!summary.value) return 0;
  const m = new Date().getMonth() + 1;
  return summary.value.monthly.find((x) => x.month === m)?.total || 0;
});
const previousMonthTotal = computed(() => {
  if (!summary.value) return 0;
  const m = new Date().getMonth(); // previous month (1-indexed already -1)
  const target = m === 0 ? 12 : m;
  return summary.value.monthly.find((x) => x.month === target)?.total || 0;
});
const changePercent = computed(() => {
  if (!previousMonthTotal.value) return 0;
  return ((currentMonthTotal.value - previousMonthTotal.value) / previousMonthTotal.value) * 100;
});

function formatCurrency(v) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
}

async function loadData() {
  const [summaryRes, categoryRes] = await Promise.all([
    api.get('/dashboard/summary', { params: { year: year.value } }),
    api.get('/dashboard/by-category', { params: { year: year.value } }),
  ]);
  summary.value = summaryRes.data;
  byCategory.value = categoryRes.data;
}

onMounted(loadData);
</script>
