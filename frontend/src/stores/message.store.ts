import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';
import { useWsStore } from './ws.store';
import type { Message } from 'src/types';

import { useChannelStore } from './channel.store';

export const useMessageStore = defineStore('message', () => {
  const wsStore = useWsStore();
  const messages = ref<Message[]>([]);

  const channelStore = useChannelStore();

  async function createMessage(channelId: string, content: string) {
    await api.post(`/channels/${channelId}/messages`, { content });
  }

  // Load messages with REST and then start listening to new messages with websocket
  async function loadMessages(channelId: string) {
    const data = await api.get(`/channels/${channelId}/messages`);
    console.log(data);
    messages.value = data.messages;

    // Start listening for new messages
    wsStore.connect();
    wsStore.socket.off('message:new');
    wsStore.socket.emit('channel:join', channelId);
    console.log(`[WS] joined channel ${channelId}`);

    wsStore.socket.on('message:new', (msg: Message) => {
      console.log(`[WS]: received message`, msg);
      messages.value.push(msg);
    });

    return data.messages;
  }

  return { messages, loadMessages, createMessage };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
