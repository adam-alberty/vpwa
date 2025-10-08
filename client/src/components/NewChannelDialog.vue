<template>
  <q-btn flat round icon="add" color="secondary" @click="show = true" />

  <q-dialog v-model="show" backdrop-filter="brightness(70%)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Create a new channel</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-y-md full-width">
          <q-input
            filled
            autofocus
            v-model="channelName"
            label="Channel name *"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
          />

          <q-btn-toggle
            v-model="channelType"
            toggle-color="primary"
            :options="[
              { label: 'Private', value: 'private' },
              { label: 'Public', value: 'public' },
            ]"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Create Channel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);

const channelName = ref('');
const channelType = ref('private');

function onSubmit() {}
</script>
