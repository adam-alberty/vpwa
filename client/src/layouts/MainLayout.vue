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
        <q-toolbar-title> Channel name </q-toolbar-title>

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
            <q-badge color="primary" text-color="white" rounded> 3 </q-badge>
          </div>
          <new-channel-dialog />
        </div>
        <q-list>
          <!-- <channel-invite
            v-for="invite in invites"
            :key="invite.channelId"
            :id="invite.channelId"
            :name="invite.channelName"
          /> -->
          <channel-link
            v-for="channel in channels"
            :key="channel.id"
            v-bind="channel"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div class="absolute-bottom">
          <command-input />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelInvite from '@/components/ChannelInvite.vue';
import ChannelLink from '@/components/ChannelLink.vue';
import CommandInput from '@/components/CommandInput.vue';
import NewChannelDialog from '@/components/NewChannelDialog.vue';
import QuickSettingsDialog from '@/components/QuickSettingsDialog.vue';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const invites = ref([{ channelId: 'uuid', channelName: 'Some name' }]);
const channels = ref([] as Channel[]);

console.log('Main')

import { getRandomChannels } from 'src/stores/mock.js'; // TODO: Replace with API Call
channels.value = getRandomChannels(18);
</script>
