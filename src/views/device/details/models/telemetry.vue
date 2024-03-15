<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p><span>telemetry 遥测</span></p>
  </div>
</template>

<style scoped></style>
