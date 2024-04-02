<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p><span>settings 设置</span></p>
  </div>
</template>

<style scoped></style>
