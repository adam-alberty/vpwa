import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ref } from 'vue';
import { useWsStore } from './';
import { type Message } from 'src/types';

export const useMessageStore = defineStore('message', () => {
  const wsStore = useWsStore();

  const messages = ref<Message[]>([]);
  const currentMessage = ref('');
  const loading = ref(null);

  function startListeningForMessages() {
    wsStore.on('message:new', handleMessageReceived);
    console.log('[WS]: start listening for new messages');
  }

  function stopListeningForMessages() {
    wsStore.off('message:new', handleMessageReceived);
    console.log('[WS]: stop listening for new messages');
  }

  function handleMessageReceived(msg: Message) {
    console.log(`[WS]: received message`, msg);

    messages.value.push(msg);
  }

  // Load messages
  async function loadMessages(channelId: string | null, page = 1) {
    if (!channelId) {
      stopListeningForMessages();

      messages.value = [];
      return;
    }

    const data = await (loading.value = api.get(
      `/channels/${channelId}/messages?page=${page}`,
    )).finally(() => (loading.value = null));

    if (page == 1)
      startListeningForMessages();

    console.log(data);
    messages.value.unshift(...data.messages);
    return data;
  }

  async function sendMessage(channelId: string, content?: string) {
    content ??= currentMessage.value.trim();

    const data = await wsStore.emitAsync('message:create', { channelId, content });
    messages.value.push(data.newMessage);
    return data;
  }

  return {
    messages,
    currentMessage,
    loading,
    loadMessages,
    sendMessage,
    startListeningForMessages,
    stopListeningForMessages,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
