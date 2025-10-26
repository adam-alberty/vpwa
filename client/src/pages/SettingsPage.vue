<template>
  <div class="row items-center q-my-lg">
    <q-btn to="/" size="lg" round class="q-ma-none q-mr-sm">
      <q-icon size="lg" name="arrow_back" />
    </q-btn>
    <h1 class="q-ma-none text-h4">Settings</h1>
  </div>

  <h2 class="text-h5 q-pb-md">Account Information</h2>

  <q-form @submit="onSubmitBasic" class="q-gutter-y-md full-width" ref="basicFormRef">
    <q-input
      filled
      v-model="basicForm.username"
      label="Username *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      v-model="basicForm.email"
      label="Email *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      v-model="basicForm.firstName"
      label="First name"
      lazy-rules
    />
    <q-input
      filled
      v-model="basicForm.lastName"
      label="Last name"
      lazy-rules
    />
    <q-toggle
      v-model="basicForm.notifyOnMentionsOnly"
      label="Notify only on mentions"
    />
    <q-btn label="Update info" type="submit" color="primary" class="full-width" />
  </q-form>

  <q-separator class="q-my-xl" />

  <h2 class="text-h5 q-pb-md">Password settings</h2>

  <q-form @submit="onSubmitPasswdChange" class="q-gutter-y-md full-width" ref="passwdFormRef">
    <q-input
      v-model="passwdForm.password"
      filled
      type="password"
      label="Old password *"
      lazy-rules
      :rules="[val => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      v-model="passwdForm.passwordRepeated"
      filled
      type="password"
      label="New password *"
      lazy-rules
      :rules="[
        val => (val && val.length > 0) || 'Please type something',
        val => val === passwdForm.password || 'Passwords do not match',
      ]"
    />

    <q-btn label="Update password" type="submit" color="primary" class="full-width" />
  </q-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const basicFormRef = ref();
const passwdFormRef = ref();

const basicForm = reactive({
  username: '',
  email: '',
  firstName: '',
  lastName: '',

  notifyOnMentionsOnly: true,
});

const passwdForm = reactive({
  password: '',
  passwordRepeated: '',
});

const errorMessage = ref('');

async function onSubmitBasic() {
  try {
    const valid = await basicFormRef.value.validate();
    if (!valid) {
      return;
    }

    // TODO: Send to API
    const data = JSON.stringify(basicForm);
    console.log(data);
  } catch (err) {
    console.log(err);
    errorMessage.value = 'Err';
  }
}

async function onSubmitPasswdChange() {
  try {
    const valid = await passwdFormRef.value.validate();
    if (!valid) {
      return;
    }

    // TODO: Send to API
    const data = JSON.stringify(passwdForm);
    console.log(data);
  } catch (err) {
    console.log(err);
    errorMessage.value = 'Err';
  }
}
</script>
