<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <form
      class="bg-white shadow rounded-lg p-8 w-full max-w-sm"
      @submit.prevent="handleSubmit"
    >
      <h1 class="text-xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>

      <label class="block text-sm mb-1">ชื่อผู้ใช้</label>
      <input
        v-model="username"
        type="text"
        class="w-full border rounded px-3 py-2 mb-4"
        required
      />

      <label class="block text-sm mb-1">รหัสผ่าน</label>
      <input
        v-model="password"
        type="password"
        class="w-full border rounded px-3 py-2 mb-4"
        required
      />

      <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>

      <button
        type="submit"
        class="w-full bg-slate-900 text-white rounded py-2 hover:bg-slate-700 transition disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push({ name: 'dashboard' });
  } catch (err) {
    error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>
