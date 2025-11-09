import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/services/api';
import { ref } from 'vue';

export const useMemberStore = defineStore('member', () => {
  const members = ref<any[]>([]); // TODO : type this properly

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
