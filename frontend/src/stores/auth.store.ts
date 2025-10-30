import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: 'online' | 'dnd' | 'offline';
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
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
    const { user: usr } = await api.get('/session');
    user.value = usr;
  }

  return { login, logout, register, me, user };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
