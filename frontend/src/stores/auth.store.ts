import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));

  async function register(payload: any) {
    const result = await api.post('/users', payload);
    localStorage.setItem('token', result.token);
    token.value = result.token;
    user.value = result.user;
  }

  async function login(payload: any) {
    const result = await api.post('/session', payload);
    token.value = result.token;
    user.value = result.user;
  }

  async function logout() {
    await api.delete('/session');
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  async function me() {
    const result = await api.get('/session');
    user.value = result;
  }

  return { login, logout, register, me };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
