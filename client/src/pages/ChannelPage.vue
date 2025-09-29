<template>
  <q-page>
    <q-scroll-area style="height: 500px">
      <ul>
        <channel-message />
      </ul>
    </q-scroll-area>

    <div class="absolute-bottom">
      <textarea class="command-input bg-grey-3" placeholder="Type a message"></textarea>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ChannelMessage from 'src/components/ChannelMessage.vue';
</script>
