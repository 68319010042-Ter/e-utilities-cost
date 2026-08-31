import { defineStore } from 'pinia';

export const themePresets = {
  classic: {
    label: 'คลาสสิก',
    primary: '#0f172a',
    primaryHover: '#334155',
    onPrimary: '#ffffff',
    sidebar: '#0f172a',
    sidebarHover: '#334155',
    sidebarText: '#f1f5f9',
    appBg: '#f1f5f9',
    surface: '#ffffff',
  },
  tactical: {
    label: 'ยุทธวิธี',
    primary: '#b91c1c',
    primaryHover: '#991b1b',
    onPrimary: '#ffffff',
    sidebar: '#111111',
    sidebarHover: '#b91c1c',
    sidebarText: '#f5f5f5',
    appBg: '#f5f5f5',
    surface: '#ffffff',
  },
  ocean: {
    label: 'มหาสมุทร',
    primary: '#1d4ed8',
    primaryHover: '#1e40af',
    onPrimary: '#ffffff',
    sidebar: '#0c1e3d',
    sidebarHover: '#1d4ed8',
    sidebarText: '#eff6ff',
    appBg: '#eff6ff',
    surface: '#ffffff',
  },
  forest: {
    label: 'ป่าเขียว',
    primary: '#15803d',
    primaryHover: '#166534',
    onPrimary: '#ffffff',
    sidebar: '#0f2818',
    sidebarHover: '#15803d',
    sidebarText: '#f0fdf4',
    appBg: '#f0fdf4',
    surface: '#ffffff',
  },
  royal: {
    label: 'ม่วงหลวง',
    primary: '#7e22ce',
    primaryHover: '#6b21a8',
    onPrimary: '#ffffff',
    sidebar: '#1e1033',
    sidebarHover: '#7e22ce',
    sidebarText: '#faf5ff',
    appBg: '#faf5ff',
    surface: '#ffffff',
  },
};

const DEFAULT_PRESET = 'classic';
const STORAGE_KEY = 'shop-theme';

function applyToDom(name) {
  const p = themePresets[name];
  if (!p) return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', p.primary);
  root.style.setProperty('--color-primary-hover', p.primaryHover);
  root.style.setProperty('--color-on-primary', p.onPrimary);
  root.style.setProperty('--color-sidebar', p.sidebar);
  root.style.setProperty('--color-sidebar-hover', p.sidebarHover);
  root.style.setProperty('--color-sidebar-text', p.sidebarText);
  root.style.setProperty('--color-app-bg', p.appBg);
  root.style.setProperty('--color-surface', p.surface);
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    current: localStorage.getItem(STORAGE_KEY) || DEFAULT_PRESET,
  }),
  actions: {
    setTheme(name) {
      if (!themePresets[name]) return;
      this.current = name;
      localStorage.setItem(STORAGE_KEY, name);
      applyToDom(name);
    },
    resetTheme() {
      this.setTheme(DEFAULT_PRESET);
    },
    initTheme() {
      applyToDom(this.current);
    },
  },
});