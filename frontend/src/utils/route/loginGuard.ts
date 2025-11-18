import { useAuthStore } from '@/stores/auth-user.store';

export async function loginGuardIfMetaSet(to, form, next) {
  if (!to.meta.requiresAuth)
    return next();

  const auth = useAuthStore();
  try {
    if (to.path.includes('/auth')) // TODO: Should not allow when already logged in
      return next();
    await auth.me();
    return next();
  } catch (err) {
    console.error('User not authenticated:', err);
    return next('/auth');
  }
}
