<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-dark text-white" bordered>
      <q-toolbar>
        <q-btn
          flat
          round
          :icon="leftDrawerOpen ? 'chevron_left' : 'chevron_right'"
          @click="toggleLeftDrawer"
        >
          <q-tooltip>{{ leftDrawerOpen ? 'Hide channels' : 'show channels' }}</q-tooltip>
        </q-btn>
        <q-toolbar-title>
          <Channel-Name
            :name="channelStore.currentChannel?.name"
            :isPrivate="channelStore.currentChannel?.isPrivate"
            highlight
          />
        </q-toolbar-title>

        <div class="row q-gutter-sm">
          <div>
            <q-btn flat round dense icon="group_remove" />
            <q-tooltip>Leave channel</q-tooltip>
          </div>

          <div>
            <q-btn
              flat
              round
              dense
              icon="group"
              :color="rightDrawerOpen ? 'white' : 'grey-5'"
              @click="toggleRightDrawer"
            />
            <q-tooltip>
              {{ rightDrawerOpen ? 'Hide member list' : 'Show member list' }}
            </q-tooltip>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 60px)">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
          style="
            position: sticky;
            top: 0px;
            z-index: 1;
            height: 51px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.28);
            line-height: 1;
          "
        >
          <div class="row items-center q-gutter-x-sm">
            <span class="q-ma-none">Channels</span>
          </div>
          <new-channel-dialog ref="newChannelDialog" @create="createChannel" />
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
      <quick-settings-dialog />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-scroll-area style="height: 100%">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
          style="position: sticky; top: 0px; z-index: 1"
        >
          <div class="row items-center q-gutter-x-sm">
            <span class="q-ma-none">Channel members</span>
          </div>
        </div>
        <q-list class="q-pa-sm">
          <User-Member-Card v-for="user in members" :key="user.id" v-bind="user" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <Chat-Input
          v-model="channelStore.currentMessage"
          :commands="commands"
          @submit="sendMessage"
          @command="handleCommand"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelName from '@/components/ChannelName.vue';
import ChannelInviteCard from 'src/components/ChannelInviteCard.vue';
import ChannelCard from 'src/components/ChannelCard.vue';
import UserMemberCard from 'src/components/UserMemberCard.vue';
import ChatInput from 'src/components/ChatInput.vue';
import NewChannelDialog from '@/components/NewChannelDialog.vue';
import QuickSettingsDialog from '@/components/QuickSettingsDialog.vue';

import { computed, ref } from 'vue';
import { useChannelStore } from '@/stores/channel.store';
import { useRouter } from 'vue-router';

const router = useRouter();

const channelStore = useChannelStore();

const newChannelDialog = ref(null);

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const rightDrawerOpen = ref(false);
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

import { getRandomChannels, getRandomMessages } from '@/stores/mock.js'; // TODO: Replace with API Call, maybe move to store as action
channelStore.channels = getRandomChannels(18);
changeChannel(channelStore.channels[0]);

const members: BasicUser[] = [
  // TODO: Integrate to channel
  { id: '1', username: 'You', status: 'online' },
  { id: '2', username: 'bob', status: 'offline' },
  { id: '3', username: 'alice', status: 'dnd' },
];

const commands = [
  // Fetch from BE based on channel (most likely)
  'list',

  'invite',
  'join',
  'kick',
  'revoke',

  'quit',
  'cancel',
];

function handleCommand(command: string, args: string[]) {
  switch (command) {
    case 'list':
      toggleRightDrawer();
      break;
    case 'invite':
      console.log('Invite');
      break;
    case 'join':
      if (!args.length) return newChannelDialog.value?.open();
      break;
    case 'kick':
      console.log('Kick');
      break;
    case 'revoke':
      console.log('Revoke');
      break;
    case 'quit':
      console.log('Quit');
      break;
    case 'cancel':
      leaveChannel(channelStore.currentChannel);
      break;
  }
}

function createChannel(name: string, type: string) {
  // TODO: Send to BE and update channels based on response...
  channelStore.channels.unshift({
    id: Date.now().toString(),
    name: name.replaceAll(' ', '-'),
    isPrivate: type == 'private',
    messages: [],
    latestMessage: '',
  });
  changeChannel(channelStore.channels[0], false);
}

function leaveChannel(channel: Channel) {
  channelStore.channels = channelStore.channels.filter((c) => c.id != channel?.id);
  changeChannel(channelStore.channels[0]);
}

function changeChannel(toChannel: Channel, fetchMessages = true) {
  if (fetchMessages && !toChannel.messages?.length) {
    toChannel.messages = getRandomMessages(20, toChannel.id.charCodeAt(0)); // TODO: Replace with API Call, maybe move to store as action
  }
  channelStore.currentChannel = toChannel;
  router.push({ name: 'Channels', params: { id: toChannel.id } }).catch(console.error);
}

function sendMessage(msg: string) {
  // TODO: Send to BE and add to channel based on response
  channelStore.currentChannel?.messages?.push({
    id: Date.now().toString(),
    text: msg,
    username: 'You',
    timestamp: Date.now(),
  });
}

function acceptInvite(invite: ChannelInvite) {
  // TODO: Send to BE and update invites based on response...
  channelStore.invites = channelStore.invites.filter((i) => i.channelId !== invite.channelId);

  const invitedChannel: Channel = {
    id: invite.channelId,
    name: invite.name,
    isPrivate: invite.isPrivate,
    latestMessage: 'Somebody: Hey there, how is it going?',
  }; // (from BE)
  channelStore.channels.unshift(invitedChannel);
  changeChannel(invitedChannel);
}

function rejectInvite(invite: ChannelInvite) {
  // TODO: Send to BE and update invites based on response...
  channelStore.invites = channelStore.invites.filter((i) => i.channelId !== invite.channelId);
}
</script>
