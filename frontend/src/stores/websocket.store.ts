import { defineStore, acceptHMRUpdate } from 'pinia';
import { socket as s } from 'src/services/ws';
import { ref } from 'vue';

export const useWsStore = defineStore('websocket', () => {
  const socket = ref(s);
  const connected = ref(false);

  function connect() {
    socket.value.on('connect', () => {
      connected.value = true;
    });
  }

  function disconnect() {
    socket.value.on('disconnect', () => {
      connected.value = false;
    });
  }

  async function listenToChats(channelId: string) {
    socket.value.on('chat', (message) => {});
  }

  return {
    socket,
    connect,
    disconnect,
    listenToChats,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWsStore, import.meta.hot));
}
