import { acceptHMRUpdate, defineStore } from 'pinia';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { ref } from 'vue';

export const useWsStore = defineStore('websocket', () => {
  const socket = ref<Socket>(null);
  const connected = ref(false);

  function connect() {
    if (socket.value) return;

    socket.value = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.value.on('connect', () => {
      connected.value = true;
      console.log('[WS] connected');
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
      console.log('[WS] disconnected');
    });
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  }

  return { socket, connected, connect, disconnect };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWsStore, import.meta.hot));
}
