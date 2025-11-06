import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';

export const useMessageStore = defineStore('message', () => {
  const messages = ref<any[]>([]);

  async function loadMessages(channelId: string) {
    const data = await api.get(`/channels/${channelId}/messages`);
    console.log(data);
    messages.value = data.messages;
  }

  return { messages, loadMessages };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
}
