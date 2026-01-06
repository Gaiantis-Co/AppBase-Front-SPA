import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore();
  if (!auth.user) {
    try { await auth.me(); } catch {}
  }
  if (to.meta.requiresAuth && !auth.user) {
    return next({ name: 'login' });
  }
  next();
}
