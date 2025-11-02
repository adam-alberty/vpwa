<template>
  <q-scroll-area>
    <div
      class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
      style="position: sticky; top: 0px; z-index: 1; height: 51px; line-height: 1"
    >
      <div class="row items-center q-gutter-x-sm">
        <Logo />
        <span class="q-ma-none q-ml-sm">Channels</span>
      </div>
      <New-Channel-Dialog ref="newChannelDialog" @create="channelStore.createChannel" />
    </div>
    <q-list>
      <Channel-Invite-Card
        v-for="invite in channelStore.invites"
        :key="invite.channelId"
        v-bind="invite"
        @reject="channelStore.rejectInvite"
        @accept="channelStore.acceptInvite"
      />
      <Channel-Card
        v-for="channel in channelStore.channels"
        :key="channel.id"
        v-bind="channel"
        @click="channelStore.changeChannel(channel)"
      />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import ChannelCard from '@/components/ChannelCard.vue';
import ChannelInviteCard from '@/components/ChannelInviteCard.vue';

import NewChannelDialog from '@/components/dialogs/NewChannelDialog.vue';

import { useChannelStore } from '@/stores/channel.store';

const channelStore = useChannelStore();
</script>
