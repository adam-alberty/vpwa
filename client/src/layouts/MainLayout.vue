<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-dark text-white">
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
            <q-btn color="red-4" flat round dense icon="group_remove" @click="channelStore.leaveChannel(null, true)" />
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

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left">
      <q-scroll-area style="height: calc(100% - 60px)">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
          style="position: sticky; top: 0px; z-index: 1; height: 51px; line-height: 1"
        >
          <div class="row items-center q-gutter-x-sm">
            <Logo />
            <span class="q-ma-none q-ml-sm">Channels</span>
          </div>
          <New-Channel-Dialog ref="newChannelDialog" @create="channelStore.createChannel" />
        </div>
        <q-list>
          <Channel-Invite-Card
            v-for="invite in channelStore.invites"
            :key="invite.channelId"
            v-bind="invite"
            @reject="channelStore.rejectInvite"
            @accept="channelStore.acceptInvite"
          />
          <Channel-Card
            v-for="channel in channelStore.channels"
            :key="channel.id"
            v-bind="channel"
            @click="channelStore.changeChannel(channel)"
          />
        </q-list>
      </q-scroll-area>
      <quick-settings-dialog />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right">
      <q-scroll-area style="height: 100%">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-weight-medium bg-dark text-body1"
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
        <div>
          <div
            class="relative-position"
            style="top: -32px; left: 8px;"
          >
            <q-spinner-dots
              color="primary"
              size="2em"
            />
            <q-tooltip :offset="[0, -40]">
              <ChannelMessage id="0" text="Yes that is a great" username="Alice"></ChannelMessage>
            </q-tooltip>
          </div>

          <Chat-Input
            v-model="channelStore.currentMessage"
            :commands="commands"
            @submit="channelStore.sendMessage"
            @command="handleCommand"
            class="chat-input absolute"
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
import UserMemberCard from 'src/components/UserMemberCard.vue';
import ChatInput from 'src/components/ChatInput.vue';
import ChannelMessage from 'src/components/ChannelMessage.vue';
import NewChannelDialog from '@/components/NewChannelDialog.vue';
import QuickSettingsDialog from '@/components/QuickSettingsDialog.vue';

import { computed, ref, watch } from 'vue';
import { useChannelStore } from '@/stores/channel.store';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { showMentionNotification } from '@/utils/notifications';

const $q = useQuasar();
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

watch(() => $q.appVisible, (val, oldVal) => {
  if (oldVal)
    return

  //TODO load notifications from BE...
  showMentionNotification({username: "Alice", text: "Good job! Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi."})
})

import { getRandomChannels, getRandomMessages } from '@/stores/mock.js'; // TODO: Replace with API Call, maybe move to store as action
import Logo from 'src/components/Logo.vue';
channelStore.channels = getRandomChannels(18);
channelStore.changeChannel();

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
      channelStore.leaveChannel();
      break;
  }
}
</script>

<style lang="sass" scoped>
.chat-input
  height: 60px
  bottom: 0
</style>
