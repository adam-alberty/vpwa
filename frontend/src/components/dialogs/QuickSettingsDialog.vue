<template>
  <div v-if="auth?.user" style="position: relative">
    <button class="settings-dialog">
      <UserAvatar v-bind="auth.user" size="40px" color="primary" text-color="white" />
      <div class="settings-dialog__user">
        <div>{{ auth.user.firstName }} {{ auth.user.lastName }}</div>
        <div class="text-left text-grey-5">@{{ auth.user.username }}</div>
      </div>
    </button>

    <q-menu
      @hide="onHide"
      anchor="top middle"
      self="bottom middle"
      class="no-shadow"
      :offset="[10, 20]"
    >
      <div class="dropdown">
        <q-btn-toggle
          v-model="auth.user.status"
          :toggle-color="statusColors[auth.user.status]"
          :options="[
            { label: 'Online', value: 'online', class: `text-positive` },
            { label: 'DND', value: 'dnd', class: 'text-negative' },
            { label: 'Offline', value: 'offline', class: 'text-accent' },
          ]"
        />
        <!-- <q-btn
          outline
          to="/settings"
          label="Account settings"
          icon="settings"
          color="primary"
          class="full-width"
          align="left"
        /> -->
        <q-toggle v-model="notifyOnMentionsOnly" label="Notify only on mentions" />
        <q-btn
          align="left"
          label="Logout"
          icon="logout"
          color="red"
          class="full-width"
          @click="logout"
        />
      </div>
    </q-menu>
  </div>
</template>

<script lang="ts" setup>
import UserAvatar from '@/components/UserAvatar.vue';
import { useAuthStore } from '@/stores/auth-user.store';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { error } from '@/utils/toast';
import {
  useChannelStore,
  useInviteStore,
  useMemberStore,
  useMessageStore,
  useUiStore,
  useWsStore,
} from 'src/stores';

const statusColors = {
  online: 'positive',
  dnd: 'negative',
  offline: 'accent',
};

const router = useRouter();
const auth = useAuthStore();
const notifyOnMentionsOnly = ref(false);

let debounceTimeout;

function onHide() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = null;

    auth.changeStatus().catch(error);
  }
}

watch(
  () => auth.user?.status,
  () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      auth.changeStatus().catch(error);
      debounceTimeout = null;
    }, 1000);
  },
);

async function logout() {
  await auth.logout();
  router
    .replace({ name: 'Login' })
    .then(() => {
      window.location.reload();
    })
    .catch(console.error);
}
</script>

<style lang="scss" scoped>
.settings-dialog {
  box-sizing: border-box;
  border: none;
  outline: none;
  resize: none;
  font-size: large;
  border-radius: 0.7rem;
  width: 100%;
  padding: 1rem;
  height: 70px;
  border: 1px solid #26272b;

  display: flex;
  align-items: center;
  outline: none;
  background-color: $input;
  cursor: pointer;

  &:hover {
    filter: brightness(130%);
  }

  -webkit-appearance: none;
  text-align: inherit;
  box-shadow: none;
  cursor: pointer;
  border: none;
  color: inherit;
  font: inherit;

  &__user {
    margin-left: 0.8rem;
    line-height: 1.3;
  }
}
</style>
