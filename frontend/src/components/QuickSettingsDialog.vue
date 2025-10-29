<template>
  <button class="settings-dialog" @click="show = true">
    <q-avatar size="36px" color="grey-5" text-color="black">S </q-avatar>
    <div class="settings-dialog__user">
      <div class="text-weight-bold">Some user</div>
      <div class="text-left text-grey-5">@user</div>
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
            { label: 'Online', value: 'online', class: `text-positive`},
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const statusColors = {
  online: 'positive',
  dnd: 'negative',
  offline: 'accent',
}

const router = useRouter();

const show = ref(false);
const status = ref('online');

function logout() {
  router.push({ name: 'Login' }).catch(console.error);
}
</script>
