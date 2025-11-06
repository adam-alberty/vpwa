<template>
  <q-scroll-area style="flex-grow: 1">
    <div
      class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
      style="position: sticky; top: 0px; z-index: 1; height: 51px; line-height: 1"
    >
      <div class="row items-center q-gutter-x-sm">
        <Logo />
        <span class="q-ma-none q-ml-sm">Channels</span>
      </div>
      <NewChannelDialog />
    </div>
    <q-list class="list">
      <ChannelInviteCard
        v-for="invite in inviteStore.invites"
        :key="invite.channelId"
        v-bind="invite"
        @reject="inviteStore.rejectInvite"
        @accept="inviteStore.acceptInvite"
      />
      <ChannelCard
        v-for="channel in channelStore.channels"
        :key="channel.id"
        v-bind="channel"
        @click="changeChannel(channel.id)"
      />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import NewChannelDialog from '@/components/dialogs/NewChannelDialog.vue';
import ChannelInviteCard from '@/components/ChannelInviteCard.vue';
import ChannelCard from '@/components/ChannelCard.vue';
import { useChannelStore } from '@/stores/channel.store';
import { useInviteStore } from 'src/stores/invite.store';

const channelStore = useChannelStore();
const inviteStore = useInviteStore();

function changeChannel(id: string) {}
</script>

<style scoped lang="scss">
.list {
  padding: 1rem;
}
</style>
