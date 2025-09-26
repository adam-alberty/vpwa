<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> #channel </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 100px)">
        <q-list bordered class="q-pb-sm">
          <q-item-label
            header
            class="text-bold text-h6 text-primary bg-white"
            style="position: sticky; top: 0px; z-index: 1"
          >
            <div class="row items-center q-gutter-x-sm">
              <span>Invites</span>
              <q-badge color="primary" text-color="white" rounded> 3 </q-badge>
            </div>
          </q-item-label>

          <q-item v-for="n in 3" :key="n" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="grey-3" text-color="grey-7"> C </q-avatar>
            </q-item-section>

            <q-item-section> channel_name </q-item-section>

            <q-item-section side>
              <div class="row items-center q-gutter-xs">
                <q-btn flat dense icon="check" color="green" />
                <q-btn flat dense icon="close" color="red" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list padding>
          <div
            class="row justify-between items-center q-pa-3 bg-white"
            style="position: sticky; top: 0px; z-index: 1"
          >
            <q-item-label header class="text-bold text-h6 text-primary">
              <div class="row items-center q-gutter-x-sm">
                <span>Channels</span>
                <q-badge color="primary" text-color="white" rounded> 3 </q-badge>
              </div>
            </q-item-label>
            <div class="q-pr-md">
              <new-channel-dialog />
            </div>
          </div>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white"> A </q-avatar>
            </q-item-section>

            <q-item-section> active_channel </q-item-section>
          </q-item>

          <q-item v-for="n in 50" :key="n" clickable v-ripple>
            <q-item-section avatar>
              <q-avatar color="grey-3" text-color="grey-7"> C </q-avatar>
            </q-item-section>

            <q-item-section> channel_name </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <div
        class="absolute-bottom row items-center justify-between bg-grey-3 q-gutter-x-sm q-pa-md"
        style="height: 100px"
      >
        <div class="row items-center q-gutter-x-sm">
          <q-avatar size="56px" color="grey-5" text-color="black">S </q-avatar>
          <div>
            <div class="text-weight-bold">Some user</div>
            <div>@user</div>
          </div>
        </div>
        <q-btn icon="logout" round flat />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NewChannelDialog from 'src/components/NewChannelDialog.vue';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
