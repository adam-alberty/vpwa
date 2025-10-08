<template>
  <q-scroll-area class="" style="height: calc(100vh - 200px)">
    <channel-message
      v-for="message in messages"
      :key="message.id"
      :username="message.username"
      :text="message.text"
      :timestamp="new Date(message.timestamp)"
    />
  </q-scroll-area>
</template>

<script setup lang="ts">
import ChannelMessage from '@/components/ChannelMessage.vue';

const messages = [
  {
    id: 'c1e1e2f7-4a2a-453e-b5f7-8d964fa9c0a1',
    username: 'alice',
    text: 'Hey, are we still on for the meeting later?',
    timestamp: '2025-10-08T09:00:00.000Z',
  },
  {
    id: 'f2b9d49a-87b0-4c8e-b9a3-b1740934f207',
    username: 'bob',
    text: "Yes, let's start at 3pm like we planned.",
    timestamp: '2025-10-08T09:02:00.000Z',
  },
  {
    id: '2c3dbe53-4f57-4d76-95c4-0a12d083c5d4',
    username: 'charlie',
    text: "Don't forget to check the budget report.",
    timestamp: '2025-10-08T09:04:00.000Z',
  },
  {
    id: 'a5e83bce-ecc6-4e3f-81c2-b2a7c00b13cb',
    username: 'diana',
    text: 'Already reviewed it, looks good to me.',
    timestamp: '2025-10-08T09:06:00.000Z',
  },
  {
    id: 'abf14d3a-f3ff-4df6-90aa-78bfa1aaac5a',
    username: 'eve',
    text: "I'll upload the final draft in a moment.",
    timestamp: '2025-10-08T09:08:00.000Z',
  },
  {
    id: '44ea26f4-8599-4999-922d-28040f2ac1f9',
    username: 'bob',
    text: 'Thanks! Really appreciate the help.',
    timestamp: '2025-10-08T09:10:00.000Z',
  },
  {
    id: '95fcd5de-7861-4e46-8234-d2369c82acb0',
    username: 'alice',
    text: 'No problem. Let me know if anything else comes up.',
    timestamp: '2025-10-08T09:12:00.000Z',
  },
  {
    id: '80f6aa6d-3b11-4fae-8ff5-d460a1eb8db5',
    username: 'charlie',
    text: 'Can someone take over the notes during the meeting?',
    timestamp: '2025-10-08T09:14:00.000Z',
  },
  {
    id: 'b1a35c2e-9c79-47fa-91a1-0130fae5f361',
    username: 'diana',
    text: 'I can do it.',
    timestamp: '2025-10-08T09:16:00.000Z',
  },
  {
    id: '3190e6e2-16ec-4a4f-8c2f-06b7e77ab8d0',
    username: 'eve',
    text: "Great! I'll send the agenda shortly.",
    timestamp: '2025-10-08T09:18:00.000Z',
  },
  {
    id: 'db16ad0c-c1fc-4e2f-90b4-22edc37f9d62',
    username: 'bob',
    text: 'Make sure to include the Q4 targets discussion.',
    timestamp: '2025-10-08T09:20:00.000Z',
  },
  {
    id: '3c588173-20c2-40cf-8855-18f82a836e1a',
    username: 'alice',
    text: 'Will do. Also adding the client feedback review.',
    timestamp: '2025-10-08T09:22:00.000Z',
  },
  {
    id: 'ae528839-3e2d-4f7a-950b-82c5c9cbe3f9',
    username: 'charlie',
    text: 'Is the design mockup finalized?',
    timestamp: '2025-10-08T09:24:00.000Z',
  },
  {
    id: 'f0f826db-e1d2-4e7a-b92b-3cc84eeff67c',
    username: 'diana',
    text: 'Not yet, still waiting on a few assets.',
    timestamp: '2025-10-08T09:26:00.000Z',
  },
  {
    id: '1a3bd6a0-4047-4469-8e11-9c0b3e91a84d',
    username: 'eve',
    text: "I'll ping the design team to speed things up.",
    timestamp: '2025-10-08T09:28:00.000Z',
  },
];
</script>
