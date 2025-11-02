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
            <q-btn
              color="red-4"
              flat
              round
              dense
              icon="group_remove"
              @click="channelStore.leaveChannel(null, true)"
            />
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

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" :breakpoint="850">
      <Channels-Menu style="height: calc(100% - 60px)" />
      <Quick-settings-dialog />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" :breakpoint="1100">
      <Members-Menu style="height: 100%" />
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div>
          <div class="relative-position" style="top: -32px; left: 8px">
            <q-spinner-dots color="primary" size="2em" />
            <q-tooltip :offset="[0, -40]">
              <Channel-Message id="0" text="Yes that is a great" username="Alice"></Channel-Message>
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
import ChatInput from '@/components/ChatInput.vue';
import ChannelMessage from '@/components/ChannelMessage.vue';
import ChannelsMenu from '@/components/menus/ChannelsMenu.vue';
import MembersMenu from '@/components/menus/MembersMenu.vue';
import QuickSettingsDialog from '@/components/dialogs/QuickSettingsDialog.vue';
import { ref, watch } from 'vue';
import { useChannelStore } from '@/stores/channel.store';
import { useQuasar } from 'quasar';
import { showMentionNotification } from '@/utils/notifications';

const $q = useQuasar();

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

watch(
  () => $q.appVisible,
  (val, oldVal) => {
    if (oldVal) return;

    // TODO Rework when PWA is implemented to sys notifications
    //TODO load notifications from BE...
    showMentionNotification({
      username: 'Alice',
      text: 'Good job! Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi.',
    });
  },
);

import { getRandomChannels, getRandomMessages } from '@/stores/mock.js'; // TODO: Replace with API Call, maybe move to store as action
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
channelStore.channels = getRandomChannels(18);
channelStore.changeChannel();

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
