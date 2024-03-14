<script setup lang="ts">
defineProps<{
  id: string;
}>();

</script>

<template>
  <div>
    <p>设备id：{{ id }}</p>
    <p><span>message 信息</span></p>
  </div>

</template>

<style scoped>

</style>
