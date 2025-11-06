<template>
  <div class="box">
    <div>
      <div class="avatar"></div>
    </div>
    <div class="strip-box">
      <div class="strip" style="width: 300px"></div>
      <div class="strip" style="width: 240px"></div>
      <div class="strip" style="width: 280px"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  display: flex;
  align-items: start;
  gap: 20px;
  padding: 1rem 1rem;
  animation: pulse 3s infinite;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: $dark;
}

.strip-box {
  display: grid;
  gap: 1rem;
}

.strip {
  height: 12px;
  border-radius: 0.5rem;
  flex-grow: 1;
  flex-shrink: 0;
  background-color: $dark;
}

@keyframes pulse {
  0% {
    filter: brightness(100%);
  }
  50% {
    filter: brightness(130%);
  }
  100% {
    filter: brightness(100%);
  }
}
</style>
