<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <h2 class="text-xl font-bold mr-4">เปรียบเทียบรายปี</h2>
      <select v-model.number="year1" class="border rounded px-2 py-1" @change="load">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <span>เทียบกับ</span>
      <select v-model.number="year2" class="border rounded px-2 py-1" @change="load">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>

    <table class="w-full bg-white rounded-lg shadow">
      <thead>
        <tr class="text-left text-sm text-slate-500 border-b">
          <th class="p-3">เดือน</th>
          <th class="p-3">{{ year1 }}</th>
          <th class="p-3">{{ year2 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in 12" :key="m" class="border-b">
          <td class="p-3">เดือน {{ m }}</td>
          <td class="p-3">{{ formatCurrency(compareData?.monthly?.[year1]?.[m - 1]) }}</td>
          <td class="p-3">{{ formatCurrency(compareData?.monthly?.[year2]?.[m - 1]) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const currentYear = new Date().getFullYear();
const year1 = ref(currentYear - 1);
const year2 = ref(currentYear);
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

const compareData = ref(null);
const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };

const chartData = computed(() => {
  if (!compareData.value) return null;
  return {
    labels: Array.from({ length: 12 }, (_, i) => `เดือน ${i + 1}`),
    datasets: [
      {
        label: String(year1.value),
        backgroundColor: '#94a3b8',
        data: compareData.value.monthly[year1.value],
      },
      {
        label: String(year2.value),
        backgroundColor: '#0f172a',
        data: compareData.value.monthly[year2.value],
      },
    ],
  };
});

function formatCurrency(v) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0);
}

async function load() {
  const res = await api.get('/dashboard/compare', {
    params: { year1: year1.value, year2: year2.value },
  });
  compareData.value = res.data;
}

onMounted(load);
</script>
