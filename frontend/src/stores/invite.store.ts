import { defineStore, acceptHMRUpdate } from 'pinia';
import { ChannelType, type ChannelInvite } from 'src/types';
import { useWsStore } from './ws.store';
import { ref, watch } from 'vue';
import api from '@/services/api';

export const useInviteStore = defineStore('invite', () => {
  const wsStore = useWsStore();

  const invites = ref<ChannelInvite[]>([]);

  function startListeningForInvites() {
    wsStore.on('invite:new', handleInviteReceived);
    console.log('[WS]: listening for new invites');
  }

  function stopListeningForInvites() {
    wsStore.off('invite:new', handleInviteReceived);
    console.log('[WS]: stop listening for new invites');
  }

  function handleInviteReceived(invite: ChannelInvite) {
    invites.value.unshift(invite);
    console.log(`[WS]: received invite`, invite);
  }

  async function loadInvites() {
    const data = await api.get(`/invites`);
    console.log(data);

    startListeningForInvites();

    invites.value = data.invites;
    return data;
  }

  async function invite(channelId: string, username: string) {
    const data = await api.post(`/channels/${channelId}/invite`, { username });
    return data;
  }

  async function acceptInvite(invite: ChannelInvite) {
    const data = await api.delete(`/channels/${invite.channelId}/invite/accept`);
    invites.value = invites.value.filter((inv) => inv.id != invite.id);
    return data;
  }

  async function rejectInvite(invite: ChannelInvite) {
    const data = await api.delete(`/channels/${invite.channelId}/invite/reject`);
    invites.value = invites.value.filter((inv) => inv.id != invite.id);
    return data;
  }

  return { invites, loadInvites, invite, acceptInvite, rejectInvite, startListeningForInvites, stopListeningForInvites };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInviteStore, import.meta.hot));
}
