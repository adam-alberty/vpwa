import type { RouteRecordRaw } from 'vue-router';
import route from '@/utils/route';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/IndexLayout.vue'),
    children: [route('Index', '', () => import('pages/IndexPage.vue'), true)],
  },

  {
    path: '/channels',
    component: () => import('layouts/ChannelLayout.vue'),
    children: [route('Channels', ':id', () => import('pages/ChannelPage.vue'), true)],
  },

  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: '/auth/login' },
      route('Login', 'login', () => import('pages/auth/LoginPage.vue'), false),
      route('Register', 'register', () => import('pages/auth/RegisterPage.vue'), false),
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
