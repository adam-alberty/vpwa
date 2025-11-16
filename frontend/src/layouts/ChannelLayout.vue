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
            :isPrivate="channelStore.currentChannel.type == 'private'"
            highlight
          />
          <div v-else>Select a channel</div>
        </q-toolbar-title>

        <div class="row q-gutter-sm">
          <div v-if="amIAdmin || channelStore.currentChannel?.type == 'public'">
            <q-btn flat round dense
              icon="add"
            />
            <q-menu
              class="no-shadow"
              :offset="[5, 5]"
            >
              <div class="dropdown" style="min-width: 280px">
                <q-input
                  v-model="inviteNick"
                  label="Nickname to invite *"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Please type something']"
                  @keypress.enter="ev => console.log(ev)"
                  autofocus
                />
              </div>
            </q-menu>
            <q-tooltip>Invite user</q-tooltip>
          </div>

          <div>
            <q-btn flat round dense
              color="red-4"
              icon="group_remove"
              @click="leaveChannel(route.params.id as string, true)"
            />
            <q-tooltip>Leave channel</q-tooltip>
          </div>

          <div>
            <q-btn flat round dense
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
      <q-page class="page">
        <div class="chat-area">
          <router-view />
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
import { useRoute, useRouter } from 'vue-router';
import { error } from '@/utils/toast';
import { confirmDanger, confirm } from '@/utils/popups';
import { useWsStore } from 'src/stores/ws.store';

import { useChannelStore } from '@/stores/channel.store';
import { useMemberStore } from 'src/stores/member.store';
import { useAuthStore } from '@/stores/auth-user.store';
import { useUiStore } from '@/stores/ui.store';
import { computed, ref } from 'vue';

const auth = useAuthStore();
const channelStore = useChannelStore();
const memberStore = useMemberStore();
const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();

const wsStore = useWsStore();

wsStore.connect()

const inviteNick = ref('');

const amIAdmin = computed(() => memberStore.getAdmin(auth.user.id)?.id == auth.user?.id);

// Load channels
if (!channelStore.channels.length)
  channelStore.loadChannels().catch(error);

async function leaveChannel(channel: string, doConfirm = false) {
  if (doConfirm) {
    return confirmDanger('Are you sure you want to leave this channel?').onOk(() => this.leaveChannel(channel))
  }

  try {
    await channelStore.leaveChannel(channel);
    await router.replace('/');
  }
  catch (err) {
    error(err);
  }
}
</script>

<style scoped lang="scss">
.left-menu {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-input {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  margin-top: auto;
}
</style>
