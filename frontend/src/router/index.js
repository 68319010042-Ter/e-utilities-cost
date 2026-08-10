import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('../views/ExpenseListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses/create',
    name: 'expense-create',
    component: () => import('../views/ExpenseFormView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses/:id/edit',
    name: 'expense-edit',
    component: () => import('../views/ExpenseFormView.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/settings/categories',
    name: 'category-manage',
    component: () => import('../views/CategoryManageView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/ReportHistoryView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
