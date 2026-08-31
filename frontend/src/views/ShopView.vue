<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">อุปกรณ์ซ่อมแซม BB Gun</h1>
      <router-link
        :to="{ name: 'cart' }"
        class="relative px-4 py-2 rounded transition"
        :style="{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      >
        ตะกร้า
        <span
          v-if="cart.totalItems > 0"
          class="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white"
        >
          {{ cart.totalItems }}
        </span>
      </router-link>
    </div>

    <p v-if="loading" class="text-slate-500">กำลังโหลดสินค้า...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>
    <p v-else-if="products.length === 0" class="text-slate-500">ยังไม่มีสินค้า</p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-xl p-4 flex flex-col card-surface"
      >
        <img
          v-if="product.image_path"
          :src="product.image_path"
          :alt="product.name"
          class="w-full h-40 object-cover rounded mb-3"
        />
        <div v-else class="w-full h-40 bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-400">
          ไม่มีรูปภาพ
        </div>

        <h2 class="font-semibold mb-1">{{ product.name }}</h2>
        <p class="text-sm text-slate-500 mb-2 line-clamp-2">{{ product.description }}</p>
        <p class="font-bold text-lg mb-2">{{ formatPrice(product.price) }} บาท</p>
        <p class="text-sm mb-3" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
          {{ product.stock > 0 ? `คงเหลือ ${product.stock} ชิ้น` : 'สินค้าหมด' }}
        </p>

        <button
          class="mt-auto rounded py-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          :style="{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }"
          :disabled="product.stock === 0"
          @click="cart.addItem(product)"
        >
          ใส่ตะกร้า
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useCartStore } from '../stores/cart';

const products = ref([]);
const loading = ref(true);
const error = ref('');
const cart = useCartStore();
const hover = ref(false);

function formatPrice(value) {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

onMounted(async () => {
  try {
    const res = await api.get('/products');
    products.value = res.data;
  } catch (err) {
    error.value = 'โหลดสินค้าไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
});
</script>