import { defineStore, acceptHMRUpdate } from 'pinia';
import { getRandomMessages } from '@/stores/mock.js';
import { api } from 'src/services/api';
import { ref } from 'vue';
import type { Channel } from '@/types/channel';

export const useChannelStore = defineStore('message', () => {
  const messages = ref<Channel[]>([]);

  // Load the channels from API
  async function loadChannels() {
    const data = await api.get('/channels');
    channels.value = data.channels;
    console.log(data);
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

  async function sendMessage(msg?: string) {
    msg ??= this.currentMessage;
    if (!msg) return;

    // TODO: Send to BE and add to channel based on response
    this.currentChannel?.messages?.push({
      id: Date.now().toString(),
      text: msg,
      username: 'You',
      timestamp: Date.now(),
    });

    this.sendMessageIndex++;
  }

  async function fetchMessages(channel?: Channel, page = 1) {
    // TODO: Replace with API Call...
    channel ??= this.currentChannel;
    channel.nextMessagePage ??= page;
    channel.messages ??= [];

    if (channel.nextMessagePage++ >= 4) channel.nextMessagePage = null;
    channel.messages.unshift(...getRandomMessages(20, channel.id.charCodeAt(0) + page));
  }

  return { channels, loadChannels, createChannel, leaveChannel };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
