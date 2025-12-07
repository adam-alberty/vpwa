import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/services/api';
import { ChannelMemberRole, type UserMember } from '@/types';
import { ref, watch } from 'vue';
import { useWsStore } from './ws.store';

import { useChannelStore } from './channel.store';

export const useMemberStore = defineStore('member', () => {
  const wsStore = useWsStore();

  const members = ref<UserMember[]>([]);

  const loading = ref(null);

  function startListeningForMembers() {
    wsStore.on('member:joined', handleMemberJoined);
    wsStore.on('member:left', handleMemberLeft);

    console.log('[WS]: start listening for new members');
  }

  function stopListeningForMembers() {
    wsStore.off('member:joined', handleMemberJoined);
    wsStore.off('member:left', handleMemberLeft);

    console.log('[WS]: stop listening for new members');
  }

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
      stopListeningForMembers();

      members.value = [];
      return;
    }
    const data = await (loading.value = api.get(`/channels/${channelId}/members`))
      .finally(() => (loading.value = null));

    startListeningForMembers();

    console.log(data);
    members.value = data.members;
    return data;
  }

  function getMember(nameOrId: string) {
    return members.value.find((m) => m.id == nameOrId || m.username == nameOrId);
  }

  function getAdmin(indexOrId: string | number | null = 0) {
    if (typeof indexOrId == 'string') {
      const member = getMember(indexOrId);
      return member?.role == ChannelMemberRole.ADMIN ? member : null;
    }
    return !indexOrId ? null : members.value.filter((m) => m.role == ChannelMemberRole.ADMIN)?.[indexOrId];
  }

  async function kickMember(channelId: string, userId: string) {
    return await api.delete(`/channels/${channelId}/kick/${userId}`);
  }

  return { members, loading, loadMembers, getAdmin, getMember, kickMember, startListeningForMembers, stopListeningForMembers };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMemberStore, import.meta.hot));
}
