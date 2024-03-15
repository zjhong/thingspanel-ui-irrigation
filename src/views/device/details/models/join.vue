<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p>join 连接</p>
  </div>
</template>

<style scoped></style>
