<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">จัดการสินค้า</h1>

    <form class="bg-white border rounded-lg p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3" @submit.prevent="submitForm">
      <input v-model="form.name" placeholder="ชื่อสินค้า" class="border rounded px-3 py-2" required />
      <input v-model.number="form.price" type="number" step="0.01" min="0" placeholder="ราคา" class="border rounded px-3 py-2" required />
      <input v-model.number="form.stock" type="number" min="0" placeholder="จำนวนคงเหลือ" class="border rounded px-3 py-2" />
      <input v-model="form.image_path" placeholder="URL รูปภาพ" class="border rounded px-3 py-2" />
      <textarea v-model="form.description" placeholder="รายละเอียดสินค้า" class="border rounded px-3 py-2 sm:col-span-2" rows="2"></textarea>

      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.is_active" type="checkbox" />
        เปิดขาย
      </label>

      <div class="sm:col-span-2 flex gap-2">
        <button type="submit" class="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700 transition">
          {{ editingId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า' }}
        </button>
        <button v-if="editingId" type="button" class="border px-4 py-2 rounded" @click="resetForm">
          ยกเลิก
        </button>
      </div>

      <p v-if="error" class="text-red-600 text-sm sm:col-span-2">{{ error }}</p>
    </form>

    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b text-left text-sm text-slate-500">
          <th class="py-2">ชื่อสินค้า</th>
          <th class="py-2">ราคา</th>
          <th class="py-2">คงเหลือ</th>
          <th class="py-2">สถานะ</th>
          <th class="py-2">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id" class="border-b">
          <td class="py-2">{{ p.name }}</td>
          <td class="py-2">{{ formatPrice(p.price) }}</td>
          <td class="py-2">{{ p.stock }}</td>
          <td class="py-2">
            <span :class="p.is_active ? 'text-green-600' : 'text-slate-400'">
              {{ p.is_active ? 'เปิดขาย' : 'ปิดขาย' }}
            </span>
          </td>
          <td class="py-2 flex gap-2">
            <button class="text-blue-600 hover:underline text-sm" @click="editProduct(p)">แก้ไข</button>
            <button class="text-red-600 hover:underline text-sm" @click="deleteProduct(p.id)">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../services/api';

const products = ref([]);
const error = ref('');
const editingId = ref(null);

const form = reactive({
  name: '',
  description: '',
  price: null,
  stock: 0,
  image_path: '',
  is_active: true,
});

function formatPrice(value) {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.description = '';
  form.price = null;
  form.stock = 0;
  form.image_path = '';
  form.is_active = true;
}

async function loadProducts() {
  const res = await api.get('/products');
  products.value = res.data;
}

function editProduct(p) {
  editingId.value = p.id;
  form.name = p.name;
  form.description = p.description;
  form.price = p.price;
  form.stock = p.stock;
  form.image_path = p.image_path;
  form.is_active = p.is_active;
}

async function submitForm() {
  error.value = '';
  try {
    if (editingId.value) {
      await api.put(`/products/${editingId.value}`, form);
    } else {
      await api.post('/products', form);
    }
    resetForm();
    await loadProducts();
  } catch (err) {
    error.value = err.response?.data?.message || 'บันทึกไม่สำเร็จ';
  }
}

async function deleteProduct(id) {
  if (!confirm('ยืนยันการลบสินค้านี้?')) return;
  await api.delete(`/products/${id}`);
  await loadProducts();
}

onMounted(loadProducts);
</script>