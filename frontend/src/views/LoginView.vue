<template>
  <div class="min-h-screen flex items-center justify-center" :style="{ backgroundColor: 'var(--color-app-bg)' }">
    <form
      class="rounded-lg shadow p-8 w-full max-w-sm"
      :style="{ backgroundColor: 'var(--color-surface)' }"
      @submit.prevent="handleSubmit"
    >
      <h1 class="text-xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>

      <label class="block text-sm mb-1">ชื่อผู้ใช้</label>
      <input v-model="username" type="text" class="w-full border rounded px-3 py-2 mb-4" required />

      <label class="block text-sm mb-1">รหัสผ่าน</label>
      <input v-model="password" type="password" class="w-full border rounded px-3 py-2 mb-4" required />

      <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>

      <button
        type="submit"
        class="w-full rounded py-2 transition disabled:opacity-50"
        :style="{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }"
        :disabled="loading"
      >
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>

      <p class="text-sm text-center mt-4">
        ยังไม่มีบัญชี?
        <router-link :to="{ name: 'register' }" class="underline" :style="{ color: 'var(--color-primary)' }">
          สมัครสมาชิก
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
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const theme = useThemeStore();
onMounted(() => theme.initTheme());

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push({ name: 'shop' });
  } catch (err) {
    error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
  } finally {
    loading.value = false;
  }
}
</script>