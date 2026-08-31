<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-app-bg)' }">
    <template v-if="isAuthPage">
      <router-view />
    </template>
    <template v-else>
      <div class="md:flex">
        <AppSidebar class="hidden md:block" />
        <div class="flex-1 flex flex-col min-h-screen">
          <AppNavbar />
          <main class="flex-1 p-4 pb-20 md:pb-4">
            <router-view />
          </main>
          <MobileMenu class="md:hidden" />
        </div>
      </div>
    </template>
    <ThemePicker />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppNavbar from './components/layout/AppNavbar.vue';
import MobileMenu from './components/layout/MobileMenu.vue';
import ThemePicker from './components/layout/ThemePicker.vue';
import { useThemeStore } from './stores/theme';

const route = useRoute();
const isAuthPage = computed(() => route.name === 'login' || route.name === 'register');

const theme = useThemeStore();
onMounted(() => theme.initTheme());
</script>