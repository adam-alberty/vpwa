<template>
  <q-avatar>
    <slot>{{ username.charAt(0).toUpperCase() }}</slot>
    <span v-if="status" class="status-dot absolute" :class="[status, { 'is-typing': isTyping }]">
      <q-spinner-dots
        v-if="isTyping"
        color="secondary"
        class="typing full-width full-height"
      />
    </span>
  </q-avatar>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useWsStore } from "@/stores/ws.store";

const props = defineProps<{ username: string; status?: string, id?: string, updateStatus?: boolean, isTyping?: boolean }>()
const { id, updateStatus } = props;

const wsStore = useWsStore();

const status = ref(props.status);
if (!updateStatus)
  watch(() => props.status, newStatus => status.value = newStatus)

function updateStatusListener(data) {
  status.value = data.status;
}

function handleJoined(data) {
  if (data.id == id) {
    status.value = data.status;
  }
}

function handleLeft(data) {
  if (data.id == id) {
    status.value = null;
  }
}

onMounted(() => {
  if (updateStatus && id) {
    wsStore.on(`user:${id}:status`, updateStatusListener);
    if (props.status) {
      wsStore.on('member:joined', handleJoined);
      wsStore.on('member:left', handleLeft);
    }
  }
})

onUnmounted(() => {
  if (updateStatus && id) {
    wsStore.off(`user:${id}:status`, updateStatusListener);
    if (props.status) {
      wsStore.off('member:joined', handleJoined);
      wsStore.off('member:left', handleLeft);
    }
  }
})
</script>

<style scoped lang="sass">
.status-dot
  bottom: -2px
  right: -2px
  width: 1rem
  height: 1rem
  border-radius: 50%
  border: 2px solid #2f3136 // matches Discord background
  transition: all 0.2s

  &.is-typing
    right: -8px
    border-radius: 10px
    width: 2rem

.typing
  padding: 2px
</style>
