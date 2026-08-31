<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-xl"
      :style="{ backgroundColor: 'var(--color-primary)' }"
      @click="open = !open"
      title="เลือกธีมสี"
    >
      🎨
    </button>

    <div
      v-if="open"
      class="absolute bottom-16 right-0 bg-[var(--color-surface)] border rounded-lg shadow-xl p-4 w-56"
    >
      <p class="text-sm font-semibold mb-3 text-slate-700">เลือกธีมสี</p>
      <div class="grid grid-cols-3 gap-3 mb-3">
        <button
          v-for="(preset, key) in presets"
          :key="key"
          class="flex flex-col items-center gap-1"
          @click="theme.setTheme(key)"
        >
          <span
            class="w-8 h-8 rounded-full border-2"
            :style="{
              backgroundColor: preset.primary,
              borderColor: theme.current === key ? preset.primary : 'transparent',
            }"
          ></span>
          <span class="text-[10px] text-slate-500 text-center leading-tight">{{ preset.label }}</span>
        </button>
      </div>
      <button
        class="w-full text-xs border rounded py-1.5 text-slate-600 hover:bg-slate-50 transition"
        @click="theme.resetTheme()"
      >
        รีเซ็ตเป็นค่าเริ่มต้น
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useThemeStore, themePresets } from '../../stores/theme';

const theme = useThemeStore();
const presets = themePresets;
const open = ref(false);
</script>