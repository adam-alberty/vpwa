<template>
  <q-layout view="lHh lpR fFf">
    <!-- Config of layout header, footer and drawers, what overlaps what etc... -->

    <q-drawer show-if-above v-model="uiStore.leftDrawerOpen" side="left" :breakpoint="850">
      <div class="left-menu">
        <ChannelsMenu />
        <div class="settings-dialog">
          <QuickSettingsDialog />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div class="chat-input">
          <ChatInput @command="handleCommand" :commands="['join']" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelsMenu from '@/components/menus/ChannelsMenu.vue';
import QuickSettingsDialog from '@/components/dialogs/QuickSettingsDialog.vue';
import ChatInput from '@/components/ChatInput.vue';
import { useChannelStore, useUiStore, useWsStore, useInviteStore } from '@/stores';
import { error } from '@/utils/toast';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const channelStore = useChannelStore();
const inviteStore = useInviteStore();
const uiStore = useUiStore();
const router = useRouter();
const wsStore = useWsStore();

// Connect to websocket
wsStore.connect();

// Request notification permission
onMounted(async () => {
  if (window.Notification && Notification.permission !== 'granted') {
    const state = await Notification.requestPermission();
    if (state === 'default') {
      error('Please allow notifications for this website to be notified');
    }
  }
});

// Load channels and invites
channelStore
  .loadChannels()
  .then(async (data) => {
    if (!channelStore.currentChannel && data.channels?.length)
      await router.push({ name: 'Channels', params: { id: data.channels[0].id } });
  })
  .catch(error);
inviteStore.loadInvites().catch(error);

if (!channelStore.currentChannel && channelStore.channels.length)
  router
    .replace({ name: 'Channels', params: { id: channelStore.channels[0].id } })
    .catch(console.error);

function handleCommand(command: string, args: string[]) {
  if (command == 'join') {
    if (!args.length) return (uiStore.addChannelDialogOpen = true);

    channelStore
      .joinChannel(args.join('-'))
      .then((data) => router.push({ name: 'Channels', params: { id: data.channel.id } }))
      .catch(error);
  }
}
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
