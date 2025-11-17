import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ref, watch } from 'vue';
import { useWsStore } from './ws.store';
import { useChannelStore } from './channel.store';
import type { Message } from 'src/types';


export const useMessageStore = defineStore('message', () => {
  const wsStore = useWsStore();
  const channelStore = useChannelStore();

  const messages = ref<Message[]>([]);

  const loading = ref(null);

  watch(() => wsStore.connected, (connected) => {
    wsStore.socket?.off('message:new', handleMessageReceived);
    if (connected) {
      // Start listening for new messages
      wsStore.socket.on('message:new', handleMessageReceived);
      console.log('[WS]: listening for new messages');
    }
  });

  function handleMessageReceived(msg: Message) {
    console.log(`[WS]: received message`, msg);
    messages.value.push(msg);
  }

  async function createMessage(channelId: string, content: string) {
    await api.post(`/channels/${channelId}/messages`, { content });
  }

  // Load messages with REST and then start listening to new messages with websocket
  async function loadMessages(channelId: string) {
    const data = await (loading.value = api.get(`/channels/${channelId}/messages`))
      .finally(() => (loading.value = null));

    console.log(data);
    messages.value = data.messages;
    return data.messages;
  }

  return { messages, loading, loadMessages, createMessage };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
