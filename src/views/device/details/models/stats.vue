<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p><span>stats 属性</span></p>
  </div>
</template>

<style scoped></style>
