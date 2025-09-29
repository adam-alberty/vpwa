<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> #channel </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 80px)">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-white"
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
            v-for="invite in invites"
            :key="invite.channelId"
            :id="invite.channelId"
            :name="invite.channelName"
          />
          <channel-preview
            v-for="channel in channels"
            :key="channel.channelId"
            :name="channel.channelName"
            :id="channel.channelId"
          />
        </q-list>
      </q-scroll-area>

      <div
        class="absolute-bottom row items-center justify-between bg-grey-3 q-gutter-x-sm q-pa-md"
        style="height: 80px"
      >
        <user-settings-dialog />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelInvite from 'src/components/ChannelInvite.vue';
import ChannelPreview from 'src/components/ChannelPreview.vue';
import NewChannelDialog from 'src/components/NewChannelDialog.vue';
import UserSettingsDialog from 'src/components/UserSettingsDialog.vue';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const invites = ref([{ channelId: 'uuid', channelName: 'Some name' }]);
const channels = ref([
  { channelId: 'uuid', channelName: 'Some name', lastMessage: 'user: something' },
  { channelId: 'another-uuid', channelName: 'Another name', lastMessage: 'user: something' },
]);
</script>
