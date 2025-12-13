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
      console.log('[WS] ' + (socket.value ? 'reconnected' : 'connected'));
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
      console.log('[WS] disconnected');
    });
  }

  function on(event: string, callback) {
    if (!socket.value) return;
    if (socket.value.listeners(event).includes(callback)) return;

    return socket.value.on(event, callback);
  }

  function off(event: string, callback) {
    if (!socket.value) return;
    return socket.value.off(event, callback);
  }

  function emit(event: string, ...args) {
    return socket.value?.emit(event, ...args);
  }

  async function emitAsync<T>(event: string, ...args) {
    if (!connected.value)
      throw new Error('Session not connected, try refreshing');

    try {
      const res = await socket.value?.timeout(2500).emitWithAck(event, ...args)
      if (res?.error) {
        throw res || 'WS ack failed to resolve'
      }

      return res as T
    } catch (err) {
      console.error('WS error:', err)
      throw err
    }
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  }

  return { socket, connected, connect, on, off, emit, emitAsync, disconnect };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWsStore, import.meta.hot));
}
