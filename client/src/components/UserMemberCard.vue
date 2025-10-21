<template>
  <q-card class="user-member-card row items-center q-pa-sm q-mb-sm">
    <q-item-section avatar>
      <q-avatar size="36px" color="grey-7" text-color="white">{{ username.charAt(0).toUpperCase() }}
        <span class="status-dot absolute" :class="status"></span>
      </q-avatar>
    </q-item-section>

    <div class="column justify-center">
      <div class="text-body1 text-weight-medium text-white">{{ username }}</div>
      <!-- <div class="text-caption text-grey-5">{{ status }}</div> -->
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { BasicUser } from 'src/types/global';
const props = defineProps<BasicUser>()
const { id , username, status } = props

const initials = computed(() =>
  username.charAt(0).toUpperCase()
)
</script>

<style lang="sass" scoped>
.user-member-card
  .status-dot
    bottom: 0
    right: 0
    width: 14px
    height: 14px
    border-radius: 50%
    border: 2px solid #2f3136 // matches Discord background

    &.online
      background-color: #43b581

    &.offline
      background-color: #747f8d

    &.dnd
      background-color: #f04747
</style>
