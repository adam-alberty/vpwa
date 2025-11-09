import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';
import type { Channel } from '@/types';

export const useChannelStore = defineStore('channel', () => {
  const channels = ref<Channel[]>([]);
  const currentChannel = ref<Channel | null>(null);

  async function setCurrentChannel(id?: string) {
    if (!id) {
      currentChannel.value = null;
      return;
    }
    const data = await api.get(`/channels/${id}`);
    console.log(data);
    currentChannel.value = data.channel;
    return data.channel;
  }

  // Load the channels from API
  async function loadChannels() {
    const data = await api.get('/channels');
    channels.value = data.channels;
    return data.channels;
  }

  // Create new channel and reload the channel list
  async function createChannel(name: string, type: string) {
    const data = await api.post('/channels', { name, type });
    channels.value.unshift(data.channel);
    return data.channel;
  }

  // Join channel and reload the channel list
  async function joinChannel(name: string) {
    const data = await api.post(`/channels/join`, { name });
    channels.value.unshift(data.channel);
    return data.channel;
  }

  // Leave channel and reload the channel list
  async function leaveChannel(id: string, set = true) {
    const data = await api.delete(`/channels/${id}`);
    channels.value = channels.value.filter((c) => c.id != data.channel.id);
    if (set)
      await setCurrentChannel(null);
    return data.channel;
  }

  return { channels, currentChannel, loadChannels, createChannel, leaveChannel, setCurrentChannel, joinChannel };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
