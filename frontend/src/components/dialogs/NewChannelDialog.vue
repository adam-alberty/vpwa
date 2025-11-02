<template>
  <q-btn flat dense round icon="add" color="white" @click="show = true">
    <q-tooltip>Add channel</q-tooltip>
  </q-btn>

  <q-dialog v-model="show" backdrop-filter="brightness(70%)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Create a new channel</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-y-md full-width" ref="formRef">
          <q-input
            filled
            autofocus
            v-model="formData.name"
            label="Channel name *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (val) =>
                (val && val.length <= 30) ||
                `Channel name is ${val.length - 30} characters over the limit`,
            ]"
          />

          <q-btn-toggle
            v-model="formData.type"
            toggle-color="primary"
            :options="[
              { label: 'Private', value: 'private' },
              { label: 'Public', value: 'public' },
            ]"
          />

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Create Channel" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { api } from '@/services/api';
import { reactive, ref } from 'vue';

const $q = useQuasar();
const show = ref(false);

const formData = reactive({
  name: '',
  type: 'private',
});

const formRef = ref(null);

async function onSubmit() {
  try {
    await api.post('/channels', formData);
  } catch (err) {
    $q.notify({
      message: err.message,
      color: 'red',
      position: 'top',
    });
  }
  show.value = false;
}

function open() {
  show.value = true;
}

function close() {
  show.value = false;
}

defineExpose({
  open,
  close,
});
</script>
