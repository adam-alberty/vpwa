<template>
  <div class="box">
    <div>Select or create a channel to start chatting</div>
  </div>
</template>

<script setup lang="ts">
import { useChannelStore } from 'src/stores/channel.store';
import { useUiStore } from 'src/stores/ui.store';

const channelStore = useChannelStore();
const uiStore = useUiStore();

channelStore.setCurrentChannel(null);
uiStore.toggleLeftDrawer(false);
</script>

<style scoped lang="scss">
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: $secondary;
}
</style>
