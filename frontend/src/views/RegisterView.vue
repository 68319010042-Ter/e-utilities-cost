<template>
  <div class="min-h-screen flex items-center justify-center" :style="{ backgroundColor: 'var(--color-app-bg)' }">
    <form
      class="rounded-lg shadow p-8 w-full max-w-sm"
      :style="{ backgroundColor: 'var(--color-surface)' }"
      @submit.prevent="handleSubmit"
    >
      <h1 class="text-xl font-bold mb-6 text-center">สมัครสมาชิก</h1>

      <label class="block text-sm mb-1">ชื่อผู้ใช้</label>
      <input v-model="username" type="text" class="w-full border rounded px-3 py-2 mb-4" required />

      <label class="block text-sm mb-1">ชื่อ-นามสกุล</label>
      <input v-model="fullName" type="text" class="w-full border rounded px-3 py-2 mb-4" />

      <label class="block text-sm mb-1">รหัสผ่าน</label>
      <input v-model="password" type="password" class="w-full border rounded px-3 py-2 mb-4" required minlength="6" />

      <label class="block text-sm mb-1">ยืนยันรหัสผ่าน</label>
      <input v-model="confirmPassword" type="password" class="w-full border rounded px-3 py-2 mb-4" required />

      <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-sm mb-4">{{ success }}</p>

      <button
        type="submit"
        class="w-full rounded py-2 transition disabled:opacity-50"
        :style="{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }"
        :disabled="loading"
      >
        {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
      </button>

      <p class="text-sm text-center mt-4">
        มีบัญชีอยู่แล้ว?
        <router-link :to="{ name: 'login' }" class="underline" :style="{ color: 'var(--color-primary)' }">
          เข้าสู่ระบบ
        </router-link>
      </p>
    </form>
    <ThemePicker />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import ThemePicker from '../components/layout/ThemePicker.vue';

const username = ref('');
const fullName = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const theme = useThemeStore();
onMounted(() => theme.initTheme());

async function handleSubmit() {
  error.value = '';
  success.value = '';
  if (password.value !== confirmPassword.value) {
    error.value = 'รหัสผ่านไม่ตรงกัน';
    return;
  }
  loading.value = true;
  try {
    await auth.register(username.value, password.value, fullName.value);
    success.value = 'สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...';
    setTimeout(() => router.push({ name: 'login' }), 1000);
  } catch (err) {
    error.value = err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>