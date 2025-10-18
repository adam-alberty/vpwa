<template>
  <div class="row items-center q-my-lg">
    <q-btn to="/" size="lg" round class="q-ma-none q-mr-sm">
      <q-icon size="lg" name="arrow_back" />
    </q-btn>
    <h1 class="q-ma-none text-h4">Settings</h1>
  </div>

  <h2 class="text-h5 q-pb-md">Account Information</h2>

  <q-form @submit="onSubmit" class="q-gutter-y-md full-width">
    <q-input
      filled
      v-model="form.username"
      label="Username *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      v-model="form.email"
      label="Email *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      v-model="form.firstName"
      label="First name *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      v-model="form.lastName"
      label="Last name *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-btn label="Update info" type="submit" color="primary" class="full-width" />
  </q-form>

  <q-separator class="q-my-xl" />

  <h2 class="text-h5 q-pb-md">Password settings</h2>

  <q-form @submit="onSubmit" class="q-gutter-y-md full-width">
    <q-input
      filled
      v-model="form.username"
      label="Old password *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      v-model="form.username"
      label="New password *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-btn label="Update password" type="submit" color="primary" class="full-width" />
  </q-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const formRef = ref();
const form = reactive({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
});
const errorMessage = ref('');

async function onSubmit() {
  try {
    const valid = await formRef.value.validate();

    if (!valid) {
      return;
    }

    const data = JSON.stringify({});
    console.log(data);
  } catch (err) {
    console.log(err);
    errorMessage.value = 'Could not log in';
  }
}
</script>
