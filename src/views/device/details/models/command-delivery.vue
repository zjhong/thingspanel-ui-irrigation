<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p>command-delivery 命令（下发）</p>
  </div>
</template>

<style scoped></style>
