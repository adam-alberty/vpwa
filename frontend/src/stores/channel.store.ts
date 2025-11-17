import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ref, watch } from 'vue';
import type { Channel } from '@/types';
import { useWsStore } from './ws.store';


export const useChannelStore = defineStore('channel', () => {
  const wsStore = useWsStore();

  const channels = ref<Channel[]>([]);
  const currentChannel = ref<Channel | null>(null);

  const loading = ref(null);

  watch(() => wsStore.connected, (connected) => {
    if (!currentChannel.value?.id)
      return;

    wsStore.socket?.emit('channel:leave', currentChannel.value.id) // Just in case
    if (connected) {
      wsStore.socket.emit('channel:join', currentChannel.value.id); // Reconnect...
      console.log(`[WS] rejoined channel ${currentChannel.value.id}`);
    }
  });

  async function setCurrentChannel(id?: string) {
    if (currentChannel.value?.id) {
      wsStore.socket.emit('channel:leave', currentChannel.value.id) // Leave the prev channel room
      console.log(`[WS] left channel ${currentChannel.value.id}`)
    }

    if (!id) {
      currentChannel.value = null;
      return;
    }
    const data = await api.get(`/channels/${id}`);
    console.log(data);

    wsStore.socket.emit('channel:join', data.channel.id); // Join the channel room
    console.log(`[WS] joined channel ${data.channel.id}`);

    currentChannel.value = data.channel;
    return data;
  }

  // Load the channels from API
  async function loadChannels() {
    const data = await (loading.value = api.get('/channels'))
      .finally(() => (loading.value = null));

    channels.value = data.channels;
    return data;
  }

  // Create new channel and reload the channel list
  async function createChannel(name: string, type: string) {
    const data = await api.post('/channels', { name, type });
    channels.value.unshift(data.channel);
    return data;
  }

  // Join channel and reload the channel list
  async function joinChannel(name: string) {
    const data = await api.post(`/channels/join`, { name });
    channels.value.unshift(data.channel);
    return data;
  }

  // Leave channel and reload the channel list
  async function leaveChannel(id: string, set = true) {
    const data = await api.delete(`/channels/${id}`);
    channels.value = channels.value.filter((c) => c.id != data.channel.id);
    if (set)
      await setCurrentChannel(null);
    return data;
  }

  return { channels, currentChannel, loading, loadChannels, createChannel, leaveChannel, setCurrentChannel, joinChannel };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
