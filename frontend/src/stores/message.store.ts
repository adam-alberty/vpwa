import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ref, watch } from 'vue';
import { useWsStore } from './ws.store';
import { useChannelStore } from './channel.store';
import type { Message } from 'src/types';


export const useMessageStore = defineStore('message', () => {
  const wsStore = useWsStore();

  const messages = ref<Message[]>([]);

  watch(() => wsStore.connected, (connected) => {
    wsStore.socket?.off('message:new', handleMessageReceived);
    if (connected) {
      // Start listening for new messages
      console.log('[WS]: listening for new messages');
      wsStore.socket.on('message:new', handleMessageReceived);
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
    const data = await api.get(`/channels/${channelId}/messages`);
    console.log(data);
    messages.value = data.messages;

    return data.messages;
  }

  return { messages, loadMessages, createMessage };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
