import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ref, watch } from 'vue';
import { useAuthStore, useWsStore } from './';
import { UserStatus, type Message } from 'src/types';
import { useQuasar } from 'quasar';
import { createNotification } from 'src/utils/notifications';

export const useMessageStore = defineStore('message', () => {
  const wsStore = useWsStore();
  const authStore = useAuthStore();
  const $q = useQuasar();

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

    if (!$q.appVisible && authStore.user.status != UserStatus.DND) {
      const isMentioned = [...msg.content.matchAll(/@([a-zA-Z0-9._-]+)/g)].some(
        (m) => m[1] === authStore.user.username,
      );
      if (!isMentioned && JSON.parse(localStorage.getItem('notify_mentions_only'))) {
        console.log('[WS]: Notification omitted...')
      } else if (!createNotification(`${msg.sender.username}`, { body: msg.content })) {
        console.log('[WS]: Notification not allowed...');
      }
    }
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
    await wsStore.emitAsync('message:create', { channelId, content });
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
