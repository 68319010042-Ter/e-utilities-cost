<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">ตะกร้าสินค้า</h1>

    <p v-if="cart.items.length === 0" class="text-slate-500">
      ยังไม่มีสินค้าในตะกร้า
      <router-link :to="{ name: 'shop' }" class="text-slate-900 underline ml-2">
        กลับไปเลือกซื้อสินค้า
      </router-link>
    </p>

    <div v-else>
      <div
        v-for="item in cart.items"
        :key="item.product_id"
        class="flex items-center justify-between border-b py-3"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="item.image_path"
            :src="item.image_path"
            class="w-16 h-16 object-cover rounded"
          />
          <div>
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-sm text-slate-500">{{ formatPrice(item.price) }} บาท / ชิ้น</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <input
            type="number"
            min="1"
            class="w-16 border rounded px-2 py-1 text-center"
            :value="item.quantity"
            @change="cart.updateQuantity(item.product_id, Number($event.target.value))"
          />
          <p class="w-24 text-right font-medium">
            {{ formatPrice(item.price * item.quantity) }} บาท
          </p>
          <button class="text-red-600 hover:underline text-sm" @click="cart.removeItem(item.product_id)">
            ลบ
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <p class="text-lg font-bold">รวมทั้งหมด: {{ formatPrice(cart.totalAmount) }} บาท</p>
        <button
          class="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-700 transition disabled:opacity-50"
          :disabled="submitting"
          @click="checkout"
        >
          {{ submitting ? 'กำลังสั่งซื้อ...' : 'ยืนยันสั่งซื้อ' }}
        </button>
      </div>

      <p v-if="error" class="text-red-600 text-sm mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const router = useRouter();
const submitting = ref(false);
const error = ref('');

function formatPrice(value) {
  return Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

async function checkout() {
  error.value = '';
  submitting.value = true;
  try {
    const items = cart.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }));
    await api.post('/orders', { items });
    cart.clear();
    router.push({ name: 'shop' });
  } catch (err) {
    error.value = err.response?.data?.message || 'สั่งซื้อไม่สำเร็จ';
  } finally {
    submitting.value = false;
  }
}
</script>