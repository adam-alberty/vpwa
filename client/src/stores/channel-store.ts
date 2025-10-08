import { defineStore, acceptHMRUpdate } from 'pinia';

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as Channel[],
    invites: [{ channelId: 'uuid', name: 'Some name' }] as ChannelInvite[],
    currentChannel: null as Channel | null,
  }),

  getters: {},

  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
