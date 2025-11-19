import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ref, watch } from 'vue';
import { useWsStore } from './';
import type { Message } from 'src/types';

export const useMessageStore = defineStore('message', () => {
  const wsStore = useWsStore();

  const messages = ref<Message[]>([]);
  const currentMessage = ref('');

  const loading = ref(null);

  watch(() => wsStore.connected, (connected) => {
    stopListeningForMessages()
    if (connected) {
      // Start listening for new messages
      startListeningForMessages()
    }
  });

  function startListeningForMessages() {
    wsStore.socket.on('message:new', handleMessageReceived);
    console.log('[WS]: listening for new messages');
  }

  function stopListeningForMessages() {
    wsStore.socket?.off('message:new', handleMessageReceived);
  }

  function handleMessageReceived(msg: Message) {
    console.log(`[WS]: received message`, msg);
    messages.value.push(msg);
  }

  // Load messages
  async function loadMessages(channelId: string | null, page = 1) {
    if (!channelId) {
      messages.value = [];
      return;
    }

    const data = await (loading.value = api.get(`/channels/${channelId}/messages?page=${page}`))
      .finally(() => (loading.value = null));

    console.log(data);
    messages.value.unshift(...data.messages);
    return data;
  }

  async function sendMessage(channelId: string, content?: string) {
    content ??= currentMessage.value.trim();
    await api.post(`/channels/${channelId}/messages`, { content });
  }

  return { messages, currentMessage, loading, loadMessages, sendMessage, startListeningForMessages, stopListeningForMessages };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
