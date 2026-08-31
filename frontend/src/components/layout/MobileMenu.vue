<template>
  <header class="border-b px-4 py-3 flex items-center justify-between" :style="{ backgroundColor: 'var(--color-surface)' }">
    <span class="font-medium text-slate-700">{{ auth.user?.full_name || auth.user?.username }}</span>
    <button class="text-sm text-red-600 hover:underline" @click="handleLogout">
      ออกจากระบบ
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>