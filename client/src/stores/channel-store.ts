import { defineStore, acceptHMRUpdate } from 'pinia';

export const useCounterStore = defineStore('channel', {
  state: () => ({
    channels: [] as Channel[],
    invites: [] as ChannelInvite[],
    currentChannel: null as Channel | null,
  }),

  getters: {},

  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
