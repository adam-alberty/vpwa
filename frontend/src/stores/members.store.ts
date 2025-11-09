import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import type { UserMember } from 'src/types';
import { ref } from 'vue';

import { useChannelStore } from './channel.store';

export const useMemberStore = defineStore('member', () => {
  const members = ref<UserMember[]>([]);

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
