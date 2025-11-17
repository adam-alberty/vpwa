<template>
  <q-btn flat dense round icon="add" color="white" @click="uiStore.addChannelDialogOpen = true">
    <q-tooltip>Add channel</q-tooltip>
  </q-btn>

  <q-dialog v-model="uiStore.addChannelDialogOpen" backdrop-filter="brightness(70%)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add a channel</div>
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
            <q-btn flat label="Add" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useChannelStore, useUiStore } from 'src/stores';
import { error } from '@/utils/toast';
import { confirm } from '@/utils/popups';
import { useRouter } from 'vue-router';

const uiStore = useUiStore();
const router = useRouter();

const formData = reactive({
  name: '',
  type: 'private',
});

const formRef = ref(null);
const channelStore = useChannelStore();

function resetForm(showState = false) {
  formData.name = '';
  formData.type = 'private';
  uiStore.addChannelDialogOpen = showState;
}

async function onSubmit() {
  try {
    const channel = await channelStore.createChannel(formData.name, formData.type);
    resetForm()
    await router.push({ name: 'Channels', params: { id: channel.id } });
  } catch (err) {
    if (err.status == 409 && err?.channel?.type == 'public') {
      return confirm('Public channel with this name already exists. Do you want to join it?', 'Join existing channel?').onOk(() => {
        channelStore.joinChannel(formData.name).then(async data => {
          resetForm();
          await router.push({ name: 'Channels', params: { id: data.channel.id } });
        }).catch(error)
      })
    }

    error(err);
  }
}
</script>
