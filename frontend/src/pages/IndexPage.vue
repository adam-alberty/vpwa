<template>
  <div class="box">
    <div>Select or create a channel to start chatting</div>
  </div>
</template>

<script setup lang="ts">
import { useChannelStore } from 'src/stores/channel.store';
import { useUiStore } from 'src/stores/ui.store';
import { error } from '@/utils/toast';

const channelStore = useChannelStore();
const uiStore = useUiStore();

channelStore.setCurrentChannel(null).catch(err => {
  error(err);
});
uiStore.toggleLeftDrawer(true);
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
