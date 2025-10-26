import { useRouter } from '@/boot/router-instance'
import { defineStore, acceptHMRUpdate } from 'pinia';
import { Dialog } from 'quasar'

import { getRandomChannels, getRandomMessages } from '@/stores/mock.js';

const router = useRouter()

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channels: [] as Channel[],
    invites: [{ channelId: 'uuid', name: 'Some name' }] as ChannelInvite[],
    currentChannel: null as Channel | null,

    currentMessage: "",
    sendMessageIndex: 0
  }),

  getters: {},

  actions: {
    createChannel(name: string, type: string) {
      // TODO: Send to BE and update channels based on response...
      this.channels.unshift({
        id: Date.now().toString(),
        name: name.replaceAll(' ', '-'),
        isPrivate: type == 'private',
        messages: [],
        // latestMessage: '',
      });
      this.changeChannel(this.channels[0], false);
    },

    leaveChannel(channel?: Channel, confirm = false) {
      channel ??= this.currentChannel;
      if (confirm) {
        return Dialog.create({
          title: 'Confirm',
          message: 'Are you sure you want to leave this channel?',
          cancel: true,
          persistent: true,
          ok: {
            label: 'Yes',
            color: 'negative',
          },

        }).onOk(() => this.leaveChannel(channel))
      }

      this.channels = this.channels.filter((c) => c.id != channel?.id);
      this.changeChannel(this.channels[0]);
    },

    changeChannel(toChannel?: Channel, fetchMessages = true) {
      toChannel ??= this.channels[0];
      if (fetchMessages && !toChannel.messages?.length) {
        this.fetchMessages(toChannel);
      }
      this.currentChannel = toChannel;

      router.push({ name: 'Channels', params: { id: toChannel.id } }).catch(console.error);
    },

    sendMessage(msg?: string) {
      msg ??= this.currentMessage;
      if (!msg)
        return;

      // TODO: Send to BE and add to channel based on response
      this.currentChannel?.messages?.push({
        id: Date.now().toString(),
        text: msg,
        username: 'You',
        timestamp: Date.now(),
      });

      this.sendMessageIndex++;
    },

    fetchMessages(channel?: Channel, page = 1) {
       // TODO: Replace with API Call...
      channel ??= this.currentChannel;
      channel.nextMessagePage ??= page;
      channel.messages ??= [];

      if (channel.nextMessagePage++ >= 4)
        channel.nextMessagePage = null;
      channel.messages.unshift(...getRandomMessages(20, channel.id.charCodeAt(0) + page));
    },

    acceptInvite(invite: ChannelInvite) {
      // TODO: Send to BE and update invites based on response...
      this.invites = this.invites.filter((i) => i.channelId !== invite.channelId);

      const invitedChannel: Channel = {
        id: invite.channelId,
        name: invite.name,
        isPrivate: invite.isPrivate,
        // latestMessage: 'Somebody: Hey there, how is it going?',
      }; // (from BE)
      this.channels.unshift(invitedChannel);
      this.changeChannel(invitedChannel);
    },

    rejectInvite(invite: ChannelInvite) {
      // TODO: Send to BE and update invites based on response...
      this.invites = this.invites.filter((i) => i.channelId !== invite.channelId);
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}
