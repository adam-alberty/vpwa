<template>
  <q-btn flat round icon="add" color="secondary" @click="show = true" />

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
            v-model="channelName"
            label="Channel name *"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (val) => (val && val.length <= 30) || `Channel name is ${val.length - 30} characters over the limit`,
            ]"
          />

          <q-btn-toggle
            v-model="channelType"
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
import { ref } from 'vue';

const show = ref(false);

const channelName = ref('');
const channelType = ref('private');
const formRef = ref(null)

const emit = defineEmits<{
  (e: 'create', name: string, type: string): void
}>();

async function onSubmit() {
  const valid = await formRef.value.validate()
  if (!valid) {
    console.log('Form invalid')
    return
  }

  emit('create', channelName.value, channelType.value);

  channelName.value = '';
  channelType.value = 'private';

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
