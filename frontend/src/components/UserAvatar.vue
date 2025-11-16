<template>
   <q-avatar
    >{{ username.charAt(0).toUpperCase() }}
    <span v-if="status" class="status-dot absolute" :class="status"></span>
  </q-avatar>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useWsStore } from "@/stores/ws.store";

const props = defineProps<{ username: string; status?: string, id?: string, updateStatus?: boolean }>()
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
    wsStore.socket.on(`user:${id}:status`, updateStatusListener);
    if (props.status) {
      wsStore.socket.on('member:joined', handleJoined);
      wsStore.socket.on('member:left', handleLeft);
    }
  }
})

onUnmounted(() => {
  if (updateStatus && id) {
    wsStore.socket.off(`user:${id}:status`, updateStatusListener);
    if (props.status) {
      wsStore.socket.off('member:joined', handleJoined);
      wsStore.socket.off('member:left', handleLeft);
    }
  }
})
</script>

<style scoped lang="sass">
.status-dot
  bottom: 0
  right: 0
  width: 15px
  height: 15px
  border-radius: 50%
  border: 2px solid #2f3136 // matches Discord background
</style>
