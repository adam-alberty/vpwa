<template>
  <q-layout view="lHh lpR fFf">
    <!-- Config of layout header, footer and drawers, what overlaps what etc... -->

    <q-drawer show-if-above v-model="uiStore.leftDrawerOpen" side="left" :breakpoint="850">
      <ChannelList style="height: calc(100% - 60px)" />
      <QuickSettingsDialog />
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div>
          <ChatInput />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelList from '@/components/menus/ChannelsMenu.vue';
import QuickSettingsDialog from '@/components/dialogs/QuickSettingsDialog.vue';
import ChatInput from '@/components/ChatInput.vue';
import { useChannelStore } from '@/stores/channel.store';
import { useRoute } from 'vue-router';
import { useUiStore } from 'src/stores/ui.store';

const channelStore = useChannelStore();
const uiStore = useUiStore();
const route = useRoute();

// Load channels
channelStore.loadChannels();
</script>

<style lang="sass" scoped>
.chat-input
  height: 60px
  bottom: 0
</style>
