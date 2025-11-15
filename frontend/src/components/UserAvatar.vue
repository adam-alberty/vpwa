<template>
   <q-avatar
    >{{ username.charAt(0).toUpperCase() }}
    <span v-if="showStatus" class="status-dot absolute" :class="status"></span>
  </q-avatar>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useWsStore } from "@/stores/ws.store";

const props = withDefaults(defineProps<{ username: string; status?: string, id?: string, showStatus?: boolean, updateStatus?: boolean }>(), {
  showStatus: true
})
const { id, showStatus, updateStatus } = props;

const wsStore = useWsStore();

const status = ref(props.status || 'offline');
if (!updateStatus)
  watch(() => props.status, newStatus => status.value = newStatus)

function updateStatusListener(data) {
  status.value = data.status;
}

onMounted(() => {
  if (updateStatus && id) {
    wsStore.socket.on(`user:${id}:status`, updateStatusListener);
  }
})

onUnmounted(() => {
  if (updateStatus && id) {
    wsStore.socket.off(`user:${id}:status`, updateStatusListener);
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
