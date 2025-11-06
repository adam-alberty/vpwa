<template>
  <q-layout view="lHh lpR fFf">
    <!-- Config of layout header, footer and drawers, what overlaps what etc... -->
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          round
          :icon="uiStore.leftDrawerOpen ? 'chevron_left' : 'chevron_right'"
          @click="uiStore.toggleLeftDrawer()"
        >
          <q-tooltip>{{ uiStore.leftDrawerOpen ? 'Hide channels' : 'show channels' }}</q-tooltip>
        </q-btn>
        <q-toolbar-title>
          <ChannelName
            v-if="channelStore.currentChannel"
            :name="channelStore.currentChannel.name"
            :isPrivate="channelStore.currentChannel.type === 'private'"
            highlight
          />
          <div v-else>Select a channel</div>
        </q-toolbar-title>

        <div class="row q-gutter-sm">
          <div>
            <q-btn
              color="red-4"
              flat
              round
              dense
              icon="group_remove"
              @click="channelStore.leaveChannel(route.params.id as string)"
            />
            <q-tooltip>Leave channel</q-tooltip>
          </div>

          <div>
            <q-btn
              flat
              round
              dense
              icon="group"
              :color="uiStore.rightDrawerOpen ? 'white' : 'grey-5'"
              @click="uiStore.toggleRightDrawer()"
            />
            <q-tooltip>
              {{ uiStore.rightDrawerOpen ? 'Hide member list' : 'Show member list' }}
            </q-tooltip>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="uiStore.leftDrawerOpen" side="left" :breakpoint="850">
      <div class="left-menu">
        <ChannelList />
        <div class="settings-dialog">
          <QuickSettingsDialog />
        </div>
      </div>
    </q-drawer>

    <q-drawer show-if-above v-model="uiStore.rightDrawerOpen" side="right" :breakpoint="1100">
      <div style="height: 100%" class="members-drawer">
        <MembersMenu style="height: 100%" />
      </div>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div>
          <div class="relative-position" style="top: -32px; left: 8px">
            <q-spinner-dots color="primary" size="2em" />
          </div>
          <div class="chat-input">
            <ChatInput />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelName from '@/components/ChannelName.vue';
import ChannelList from '@/components/menus/ChannelsMenu.vue';
import MembersMenu from '@/components/menus/MembersMenu.vue';
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

.members-drawer {
  background-color: $dark-page !important;
  border-left: 1px solid;
  border-color: $border;
}
</style>
