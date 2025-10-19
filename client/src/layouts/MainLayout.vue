<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-dark text-white" bordered>
      <q-toolbar>
        <q-btn
          flat
          round
          :icon="leftDrawerOpen ? 'chevron_left' : 'chevron_right'"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <Channel-Name
            :name="channelStore.currentChannel?.name"
            :isPrivate="channelStore.currentChannel?.isPrivate"
            highlight
          />
        </q-toolbar-title>

        <quick-settings-dialog />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: 100%">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
          style="position: sticky; top: 0px; z-index: 1"
        >
          <div class="row items-center q-gutter-x-sm">
            <span class="q-ma-none">Channels</span>
            <!-- <q-badge color="primary" text-color="white" rounded> 3 </q-badge> -->
          </div>
          <new-channel-dialog />
        </div>
        <q-list>
          <Channel-Invite-Card
            v-for="invite in channelStore.invites"
            :key="invite.channelId"
            v-bind="invite"
            @reject="rejectInvite(invite)"
            @accept="acceptInvite(invite)"
          />
          <Channel-Card
            v-for="channel in channelStore.channels"
            :key="channel.id"
            v-bind="channel"
            @click="changeChannel(channel)"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div class="absolute-bottom">
          <Chat-Input v-model="channelStore.currentMessage"
            :commands="commands"
            @submit="sendMessage"
            @command="handleCommand"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelName from '@/components/ChannelName.vue';
import ChannelInviteCard from 'src/components/ChannelInviteCard.vue';
import ChannelCard from 'src/components/ChannelCard.vue';
import ChatInput from 'src/components/ChatInput.vue';
import NewChannelDialog from '@/components/NewChannelDialog.vue';
import QuickSettingsDialog from '@/components/QuickSettingsDialog.vue';

import { computed, ref } from 'vue';
import { useChannelStore } from '@/stores/channel-store';
import { useRouter } from 'vue-router';

const router = useRouter();

const channelStore = useChannelStore();

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

import { getRandomChannels, getRandomMessages } from 'src/stores/mock.js'; // TODO: Replace with API Call, maybe move to store as action
channelStore.channels = getRandomChannels(18);
changeChannel(channelStore.channels[0]);

const commands = [ // Fetch from BE based on channel (most likely)
  'list',

  'invite',
  'join',
  'kick',
  'revoke',

  'quit',
  'cancel'
]

function handleCommand(command: string, args: string[]) {
  switch (command) {
    case 'list':
      console.log('List')
      break;
    case 'invite':
      console.log('Invite')
      break;
    case 'join':
      console.log('Join')
      break;
    case 'kick':
      console.log('Kick')
      break;
    case 'revoke':
      console.log('Revoke')
      break;
    case 'quit':
      console.log('Quit')
      break;
    case 'cancel':
      leaveChannel(channelStore.currentChannel)
      break;
  }
}

function leaveChannel(channel: Channel) {
  channelStore.channels = channelStore.channels.filter((c) => c.id != channel?.id);
  changeChannel(channelStore.channels[0]);
}

function changeChannel(toChannel: Channel) {
  if (!toChannel.messages?.length) {
    toChannel.messages = getRandomMessages(20, toChannel.id.charCodeAt(0)); // TODO: Replace with API Call, maybe move to store as action
  }
  channelStore.currentChannel = toChannel
  router.push({ name: 'Channels', params: { id: toChannel.id } }).catch(console.error);
}

function sendMessage(msg: string) {
  // TODO: Send to BE and add to channel based on response
  channelStore.currentChannel?.messages?.push({ id: Date.now().toString(), text: msg, username: 'You', timestamp: Date.now() });
}

function acceptInvite(invite: ChannelInvite) {
  // TODO: Send to BE and update invites based on response...
  channelStore.invites = channelStore.invites.filter((i) => i.channelId !== invite.channelId);

  const invitedChannel: Channel = { id: invite.channelId, name: invite.name, isPrivate: invite.isPrivate, latestMessage: "Somebody: Hey there, how is it going?" }; // (from BE)
  channelStore.channels.unshift(invitedChannel);
  changeChannel(invitedChannel);
}

function rejectInvite(invite: ChannelInvite) {
  // TODO: Send to BE and update invites based on response...
  channelStore.invites = channelStore.invites.filter((i) => i.channelId !== invite.channelId);
}
</script>
