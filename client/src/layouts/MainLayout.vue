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
            <q-badge color="primary" text-color="white" rounded> 3 </q-badge>
          </div>
          <new-channel-dialog />
        </div>
        <q-list>
          <channel-invite
            v-for="invite in channelStore.invites"
            :key="invite.channelId"
            v-bind="invite"
          />
          <channel-link
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
          <command-input />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelName from '@/components/ChannelName.vue';
import ChannelInvite from '@/components/ChannelInvite.vue';
import ChannelLink from 'src/components/Channel.vue';
import CommandInput from '@/components/CommandInput.vue';
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

import { getRandomChannels, getRandomMessages } from 'src/stores/mock.js'; // TODO: Replace with API Call
channelStore.channels = getRandomChannels(18);
changeChannel(channelStore.channels[0]);

function changeChannel(toChannel: Channel) {
  if (!toChannel.messages?.length) {
    toChannel.messages = getRandomMessages(20, toChannel.id.charCodeAt(0)); // TODO: Replace with API Call
  }
  channelStore.currentChannel = toChannel
  router.push({ name: 'Channels', params: { id: toChannel.id } }).catch(console.error);
}
</script>
