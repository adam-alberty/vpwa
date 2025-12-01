import { useAuthStore } from '@/stores/auth-user.store';

export async function loginGuardIfMetaSet(to, form, next) {
  const isAuthRoute = to.path.includes('/auth');
  try {
    if (!localStorage.getItem('token')) {
      if (isAuthRoute) return next();
      throw new Error('Invalid or missing token');
    }

    if (to.meta.requiresAuth) {
      const auth = useAuthStore();
      if (!auth.user) await auth.me();
    }
    // Authorized...

    if (isAuthRoute) return next(form); // Prevent /auth if authed...
    return next();
  } catch (err) {
    console.error(err);
    return next('/auth');
  }
}
