<template>
  <q-layout view="lHh lpR fFf">
    <!-- Config of layout header, footer and drawers, what overlaps what etc... -->

    <q-drawer show-if-above v-model="uiStore.leftDrawerOpen" side="left" :breakpoint="850">
      <div class="left-menu">
        <ChannelList />
        <div class="settings-dialog">
          <QuickSettingsDialog />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div class="chat-input">
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
import { useUiStore } from 'src/stores/ui.store';
import { useWsStore } from '@/stores/ws.store';
import { error } from '@/utils/toast';

const channelStore = useChannelStore();
const uiStore = useUiStore();
const wsStore = useWsStore();

wsStore.connect()

// Load channels
channelStore.loadChannels().catch(err => {
  error(err);
});
</script>

<style scoped lang="scss">
.left-menu {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-input {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}

.settings-dialog {
  margin-top: auto;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}
</style>
