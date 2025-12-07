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

  watch(
    () => wsStore.connected,
    (newVal, oldVal) => {
      if (!currentChannel.value?.id) return;

      leaveFromChannelRoom(currentChannel.value.id);
      if (newVal && !oldVal) {
        setTimeout(() => connectToChannelRoom(currentChannel.value.id), 300); // Reconnect...
      }
    },
  );

  function connectToChannelRoom(id: string) {
    wsStore.emit('channel:join', id);
    console.log(`[WS] joined channel ${id}`);
  }

  function leaveFromChannelRoom(id: string) {
    wsStore.emit('channel:leave', id);
    console.log(`[WS] left channel ${id}`);
  }

  function startListeningForChannels() {
    wsStore.on('channel:removed', handleChannelRemoved);

    console.log(`[WS] start listening for channels`);
  }

  function stopListeningForChannels() {
    wsStore.off('channel:removed', handleChannelRemoved);

    console.log(`[WS] stop listening for channels`);
  }

  function handleChannelRemoved(data) {
    channels.value = channels.value.filter((c) => c.id != data.channel.id);
    if (currentChannel.value?.id == data.channel.id)
      setCurrentChannel(null).catch(console.error);
    console.log(`[WS]: Channel removed`, data.channel, data.message);
  }

  async function setCurrentChannel(id?: string | number) {
    if (typeof id == 'number') id = channels.value?.[id]?.id || null;

    if (currentChannel.value?.id) {
      leaveFromChannelRoom(currentChannel.value.id); // Leave the prev channel room
    }

    if (!id) {
      currentChannel.value = null;
      return;
    }
    const data = await api.get(`/channels/${id}`);
    console.log(data);

    connectToChannelRoom(data.channel.id); // Join the channel room

    currentChannel.value = data.channel;
    return data;
  }

  // Load the channels from API
  async function loadChannels() {
    const data = await (loading.value = api.get('/channels')).finally(() => (loading.value = null));

    startListeningForChannels();

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
    if (set) await setCurrentChannel(null);
    return data;
  }

  return {
    channels,
    currentChannel,
    loading,
    loadChannels,
    createChannel,
    leaveChannel,
    setCurrentChannel,
    joinChannel,
    startListeningForChannels,
    stopListeningForChannels,
    connectToChannelRoom,
    leaveFromChannelRoom,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
