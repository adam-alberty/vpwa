<template>
  <q-page>
    <q-scroll-area class="q-pa-lg" style="height: calc(100vh - 200px)">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar1.jpg"
        :text="['hey, how are you?']"
        sent
      />
      <q-chat-message
        v-for="n in 20"
        :key="n"
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
        :text="['doing fine, how r you?']"
      />
    </q-scroll-area>

    <div class="absolute-bottom">
      <textarea class="command-input bg-dark text-white" placeholder="Type a message"></textarea>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
