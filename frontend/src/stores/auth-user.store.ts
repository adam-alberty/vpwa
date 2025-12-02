import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import type { User } from 'src/types';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref(localStorage.getItem('token'));

  async function register(payload) {
    await api.post('/users', payload);
  }

  async function login(payload: { email: string; password: string }) {
    const result = await api.post('/session', payload);
    localStorage.setItem('token', result.token);
    token.value = result.token;
  }

  async function logout() {
    await api.delete('/session');
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  async function me() {
    const { user: usr } = await api.get('/session');
    user.value = usr;
  }

  async function changeStatus(status?: string) {
    status ??= user.value?.status;
    if (!status) return;

    const data = await api.put('/user/status', { status });
    user.value.status = data.user.status;
    return data;
  }

  return { login, logout, register, me, changeStatus, user };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
