import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';
import type { Channel } from '@/types/channel';

export const useChannelStore = defineStore('channel', () => {
  const channels = ref<Channel[]>([]);

  // Load the channels from API
  async function loadChannels() {
    const data = await api.get('/channels');
    channels.value = data.channels;
  }

  // Create new channel and reload the channel list
  async function createChannel(name: string, type: string) {
    await api.post('/channels', { name, type });
    await loadChannels();
  }

  // Leave channel and reload the channel list
  async function leaveChannel(id: string) {
    await api.delete(`/channels/${id}`);
    await loadChannels();
  }

  return { channels, loadChannels, createChannel, leaveChannel };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
