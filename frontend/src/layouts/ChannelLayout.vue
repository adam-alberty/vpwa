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
            v-bind="channelStore.currentChannel"
            highlight
          />
          <div v-else>Select a channel</div>
        </q-toolbar-title>

        <div class="row q-gutter-sm">
          <div v-if="amIAdmin || channelStore.currentChannel?.type == 'public'">
            <q-btn flat round dense icon="add" />
            <q-menu v-model="inviteOpen" class="no-shadow" :offset="[5, 5]">
              <q-form @submit="onInvite" class="dropdown" style="min-width: 280px">
                <q-input
                  v-model="inviteUsername"
                  label="Username to invite *"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length >= 3) || 'Please type at least 3 characters',
                  ]"
                  autofocus
                />
                <q-btn push label="Invite" type="submit" color="primary" class="full-width" />
              </q-form>
            </q-menu>
            <q-tooltip>Invite user</q-tooltip>
          </div>

          <div>
            <q-btn
              flat
              round
              dense
              color="red-4"
              icon="group_remove"
              @click="leaveChannel(route.params.id as string, true)"
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
        <ChannelsMenu />
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
            <ChatInput
              v-model="messageStore.currentMessage"
              @submit="onSubmit"
              @command="handleCommand"
              :commands="['join', 'invite', 'kick', 'cancel', 'list']"
            />
            <!-- {{messageStore.currentMessage}} -->
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelName from '@/components/ChannelName.vue';
import ChannelsMenu from '@/components/menus/ChannelsMenu.vue';
import MembersMenu from '@/components/menus/MembersMenu.vue';
import QuickSettingsDialog from '@/components/dialogs/QuickSettingsDialog.vue';
import ChatInput from '@/components/ChatInput.vue';
import { useRoute, useRouter } from 'vue-router';
import { success, error, info } from '@/utils/toast';
import { confirmDanger, confirm } from '@/utils/popups';
import { requestNotificationPermission } from 'src/utils/notifications';

import {
  useChannelStore,
  useMemberStore,
  useAuthStore,
  useUiStore,
  useInviteStore,
  useMessageStore,
  useWsStore,
} from '@/stores';
import { computed, ref, watch } from 'vue';

const auth = useAuthStore();
const channelStore = useChannelStore();
const inviteStore = useInviteStore();
const memberStore = useMemberStore();
const uiStore = useUiStore();
const messageStore = useMessageStore();

const route = useRoute();
const router = useRouter();

const wsStore = useWsStore();
wsStore.connect();

const inviteUsername = ref('');
const inviteOpen = ref(false);

const amIAdmin = computed(() => memberStore.getAdmin(auth.user.id)?.id == auth.user?.id);

requestNotificationPermission().then(state => {
  if (state == 'default') {
    info('Please allow notifications for this website to be notified');
  }
}).catch(error);

// Load channels and invites
if (!channelStore.channels.length) channelStore.loadChannels().catch(error);
if (!inviteStore.invites.length) inviteStore.loadInvites().catch(error);

let typingDebounce; // Anti congestation/spam debounce
watch(
  () => messageStore?.currentMessage?.trim(),
  (val) => {
    if (!auth?.user) return;
    if (typingDebounce) return;

    typingDebounce = setTimeout(
      () => {
        wsStore.emit(`@${auth.user.id}:typing`, {
          channelId: route.params.id,
          typing: messageStore?.currentMessage.trim(),
        });
        typingDebounce = null;
      },
      val?.length > 1 ? 300 : 1,
    );
  },
);

async function leaveChannel(channel: string, doConfirm = false) {
  if (doConfirm) {
    return confirmDanger('Are you sure you want to leave this channel?').onOk(() =>
      this.leaveChannel(channel),
    );
  }

  try {
    await channelStore.leaveChannel(channel);
    await router.replace('/');
  } catch (err) {
    error(err);
  }
}

async function onInvite() {
  try {
    const data = await inviteStore.invite(route.params.id as string, inviteUsername.value);
    inviteUsername.value = '';
    inviteOpen.value = false;

    success(data.message);
  } catch (err) {
    error(err);
  }
}

async function onSubmit() {
  await messageStore.sendMessage(route.params.id as string).catch(err => { error(err); console.error(err) });
}

function handleCommand(command: string, args: string[]) {
  if (command == 'join') {
    if (!args.length) return (uiStore.addChannelDialogOpen = true);

    return channelStore
      .joinChannel(args.join('-'))
      .then((data) => router.push({ name: 'Channels', params: { id: data.channel.id } }))
      .catch(error);
  }
  if (command == 'invite') {
    return inviteStore.invite(route.params.id as string, args.join('-')).catch(error);
  }
  if (command == 'kick') {
    const member = memberStore.getMember(args.join('-'));
    if (!member) return error('User not found');
    return memberStore.kickMember(route.params.id as string, member.id).catch(error);
  }
  if (command == 'cancel') {
    return leaveChannel(route.params.id as string, false);
  }
  if (command == 'list') {
    return uiStore.toggleRightDrawer();
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
