<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p>event-report 事件（上报）</p>
  </div>
</template>

<style scoped></style>
