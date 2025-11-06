<template>
  <button class="settings-dialog" @click="show = true">
    <q-avatar size="40px" color="primary" text-color="black">{{
      auth.user.username.charAt(0).toUpperCase()
    }}</q-avatar>
    <div class="settings-dialog__user">
      <div>{{ auth.user.firstName }} {{ auth.user.lastName }}</div>
      <div class="text-left text-grey-5">@{{ auth.user.username }}</div>
    </div>
  </button>

  <q-dialog v-model="show" backdrop-filter="brightness(70%)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Quick settings</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-gutter-y-md">
        <q-btn-toggle
          v-model="status"
          :toggle-color="statusColors[status]"
          :options="[
            { label: 'Online', value: 'online', class: `text-positive` },
            { label: 'Do not Disturb', value: 'dnd', class: 'text-negative' },
            { label: 'Offline', value: 'offline', class: 'text-accent' },
          ]"
        />

        <q-btn
          outline
          to="/settings"
          label="Account settings"
          icon="settings"
          color="secondary"
          class="full-width"
        />

        <q-btn label="Logout" icon="logout" color="red" class="full-width" @click="logout" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth.store';
import { isRef, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

const statusColors = {
  online: 'positive',
  dnd: 'negative',
  offline: 'accent',
};

const router = useRouter();
const auth = useAuthStore();

console.log(isRef(auth.user));

const show = ref(false);
const status = ref('online');

async function logout() {
  await auth.logout();
  router.push({ name: 'Login' }).catch(console.error);
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
