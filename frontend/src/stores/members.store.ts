import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import type { UserMember } from 'src/types';
import { ref, watch } from 'vue';
import { useWsStore } from './ws.store';

import { useChannelStore } from './channel.store';

export const useMemberStore = defineStore('member', () => {
  const wsStore = useWsStore();

  const members = ref<UserMember[]>([]);

  watch(() => wsStore.connected, (connected) => {
    wsStore.socket?.off('member:joined', handleMemberJoined);
    wsStore.socket?.off('member:left', handleMemberLeft);
    if (connected) {
      // Listen for joining users...
      wsStore.socket.on('member:joined', handleMemberJoined);
      wsStore.socket.on('member:left', handleMemberLeft);
    }
  });

  function handleMemberJoined(member: UserMember) {
    console.log(`[WS]: Member joined`, member);
    members.value.push(member);
  }

  function handleMemberLeft(member) {
    console.log(`[WS]: Member left`, member);
    members.value = members.value.filter((m) => m.id != member.id);
  }

  async function loadMembers(channelId: string | null) {
    if (!channelId) {
      members.value = null;
      return;
    }
    const data = await api.get(`/channels/${channelId}/members`);
    console.log(data);
    members.value = data.members;
    return data.members;
  }

  return { members, loadMembers };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMemberStore, import.meta.hot));
}
