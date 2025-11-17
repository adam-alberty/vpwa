<template>
  <q-scroll-area style="flex-grow: 1">
    <div
      class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
      style="position: sticky; top: 0px; z-index: 1; height: 51px; line-height: 1"
    >
      <div class="row items-center q-gutter-x-sm">
        <AppLogo />
        <span class="q-ma-none q-ml-sm">Channels</span>
      </div>
      <CreateChannelDialog />
    </div>
    <q-list class="list">
      <div v-if="inviteStore.invites?.length" class="q-mb-md">
        <ChannelInviteCard
          v-for="invite in inviteStore.invites"
          :key="invite.channelId"
          v-bind="invite"
          @reject="inviteStore.rejectInvite"
          @accept="inviteStore.acceptInvite"
          class="q-mb-sm"
        />
      </div>
      <ChannelCard
        v-for="channel in channelStore.channels"
        :key="channel.id"
        v-bind="channel"
        @click="changeChannel(channel.id)"
        class="q-mb-sm"
      />
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import AppLogo from 'src/components/AppLogo.vue';
import CreateChannelDialog from '@/components/dialogs/CreateChannelDialog.vue';
import ChannelInviteCard from '@/components/ChannelInviteCard.vue';
import ChannelCard from '@/components/ChannelCard.vue';
import { useChannelStore } from '@/stores/channel.store';
import { useInviteStore } from 'src/stores/invite.store';
import { useRouter } from 'vue-router';

const channelStore = useChannelStore();
const inviteStore = useInviteStore();

const router = useRouter();

async function changeChannel(id: string) {
  await router.push({ name: 'Channels', params: { id } });
}
</script>

<style scoped lang="scss">
.list {
  padding: 1rem;
}
</style>
