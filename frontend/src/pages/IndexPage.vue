<template></template>

<script setup lang="ts">
import { useChannelStore } from 'src/stores/channel.store';

const channelStore = useChannelStore();
channelStore.setCurrentChannel(null);
</script>
