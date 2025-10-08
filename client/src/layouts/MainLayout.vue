<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-dark text-white" bordered>
      <q-toolbar>
        <q-btn
          flat
          round
          :icon="leftDrawerOpen ? 'chevron_left' : 'chevron_right'"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Channel name </q-toolbar-title>

        <quick-settings-dialog />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: 100%">
        <div
          class="row items-center justify-between q-gutter-x-sm q-item text-bold text-h6 text-primary bg-dark"
          style="position: sticky; top: 0px; z-index: 1"
        >
          <div class="row items-center q-gutter-x-sm">
            <span class="q-ma-none">Channels</span>
            <q-badge color="primary" text-color="white" rounded> 3 </q-badge>
          </div>
          <new-channel-dialog />
        </div>
        <q-list>
          <channel-invite
            v-for="invite in invites"
            :key="invite.channelId"
            :id="invite.channelId"
            :name="invite.channelName"
          />
          <channel-link
            v-for="channel in channels"
            :key="channel.channelId"
            :name="channel.channelName"
            :id="channel.channelId"
            :last-message="channel.lastMessage"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
        <div class="absolute-bottom">
          <command-input />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelInvite from '@/components/ChannelInvite.vue';
import ChannelLink from '@/components/ChannelLink.vue';
import CommandInput from '@/components/CommandInput.vue';
import NewChannelDialog from '@/components/NewChannelDialog.vue';
import QuickSettingsDialog from '@/components/QuickSettingsDialog.vue';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const invites = ref([{ channelId: 'uuid', channelName: 'Some name' }]);
const channels = ref([
  {
    channelId: 'd8f0c9e1-b5f4-49b6-95d2-91f5b81f3e31',
    channelName: 'frontend-dev',
    lastMessage: 'alex: Can someone review my PR for the navbar updates?',
  },
  {
    channelId: 'c24b9b97-04f3-4479-b22e-52c1dbd8ad1d',
    channelName: 'product-roadmap',
    lastMessage: 'maria: I’ve updated the Q4 goals in the doc, feedback welcome.',
  },
  {
    channelId: 'a56c42f9-319c-4e95-9cf6-df6b0a4e35c2',
    channelName: 'general',
    lastMessage: 'josh: Reminder: All hands at 2pm today!',
  },
  {
    channelId: 'fb9f9983-184f-42ad-b430-9c4125bbd70f',
    channelName: 'channel-with-very-very-long-name',
    lastMessage: 'lina: Pushed the latest Figma updates for the onboarding flow.',
  },
  {
    channelId: '1a3c3dd3-6a76-4f1d-9b49-4565c69e30ff',
    channelName: 'customer-support',
    lastMessage: 'ben: Ticket #3487 needs escalation — login still failing.',
  },
  {
    channelId: 'd61cb376-ef84-4521-a53e-7b167dd0c37a',
    channelName: 'random',
    lastMessage: 'chloe: Anyone else trying the new coffee place on 3rd?',
  },
  {
    channelId: 'ee6e63c1-3cf2-4bc1-950b-41b68220b3a7',
    channelName: 'qa-testing',
    lastMessage: 'samir: Found a bug in the checkout flow on iOS.',
  },
  {
    channelId: 'f96a119e-39f2-404e-88fc-1c6727e11673',
    channelName: 'backend-infra',
    lastMessage: 'dan: Deployed the hotfix to production. Monitoring logs now.',
  },
  {
    channelId: '3785b8f3-96e4-4fd0-a6ec-2c842e877eab',
    channelName: 'marketing',
    lastMessage: 'tina: Drafted copy for the new landing page — thoughts?',
  },
  {
    channelId: 'c8fd594e-4de6-4fc4-8231-1c4dfabaf70a',
    channelName: 'sales-leads',
    lastMessage: 'rob: Meeting with Acme Corp went well. Follow-up scheduled.',
  },
  {
    channelId: '6af043bd-d7c4-4d2e-9f29-2e8a2e746d91',
    channelName: 'devops',
    lastMessage: 'nina: Pipeline failed on staging — investigating now.',
  },
  {
    channelId: 'e4a17e93-dae5-40ae-9c24-d4b16a20bb5e',
    channelName: 'weekly-sync',
    lastMessage: 'matt: Can we push the meeting to 3pm?',
  },
  {
    channelId: '37d7ebf4-e8cc-470e-a3ed-41b2353a0c49',
    channelName: 'support-escalations',
    lastMessage: 'dave: Customer still seeing 500 errors after patch.',
  },
  {
    channelId: '9eaf07e7-43e4-4f9a-ae1c-12cfb3793427',
    channelName: 'hiring',
    lastMessage: 'sara: Two new resumes in the shared folder.',
  },
  {
    channelId: '73dc38a0-61e7-4701-8c9b-3cd8b6c21490',
    channelName: 'mobile-app',
    lastMessage: 'ken: Pushed the latest build to TestFlight.',
  },
  {
    channelId: '2fa6d3a1-bba2-43ff-b3a6-e94e027d7a2c',
    channelName: 'ux-feedback',
    lastMessage: 'julia: Users are confused by the onboarding step 3.',
  },
  {
    channelId: 'b1a9ed36-1d74-4098-913f-826d0558c1ce',
    channelName: 'engineering',
    lastMessage: 'leo: API v2 is now live 🚀',
  },
  {
    channelId: '90a81f5f-650a-406f-8c5f-155e9f4f2ac0',
    channelName: 'analytics',
    lastMessage: 'emma: September traffic up 12% from last month.',
  },
  {
    channelId: 'c3cba6b2-27f7-4cbb-a3a6-67210e943e6d',
    channelName: 'partners',
    lastMessage: 'jack: Call with Stripe team moved to Thursday.',
  },
  {
    channelId: '7ddfb61c-cde5-4bb1-94dc-06b5eb173b87',
    channelName: 'social-media',
    lastMessage: 'mia: Scheduled the October posts — ready for review.',
  },
]);
</script>
