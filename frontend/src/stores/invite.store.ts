import { defineStore, acceptHMRUpdate } from 'pinia';
import type { ChannelInvite } from 'src/types';

export const useInviteStore = defineStore('invite', () => {
  const invites: ChannelInvite[] = [];

  async function acceptInvite(invite: ChannelInvite) {
    // // TODO: Send to BE and update invites based on response...
    // invites = this.invites.filter((i) => i.channelId !== invite.channelId);
    // const invitedChannel: Channel = {
    //   id: invite.channelId,
    //   name: invite.name,
    //   isPrivate: invite.isPrivate,
    //   // latestMessage: 'Somebody: Hey there, how is it going?',
    // }; // (from BE)
    // this.channels.unshift(invitedChannel);
    // this.changeChannel(invitedChannel);
  }

  async function rejectInvite(invite: ChannelInvite) {
    // // TODO: Send to BE and update invites based on response...
    // this.invites = this.invites.filter((i) => i.channelId !== invite.channelId);
  }

  return { invites, acceptInvite, rejectInvite };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useInviteStore, import.meta.hot));
}
