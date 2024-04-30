<script setup lang="ts">
import sceneLinkage from '@/views/automation/scene-linkage/index.vue';

defineProps<{
  id: string;
}>();
</script>

<template>
  <sceneLinkage :device_id="id" />
</template>

<style scoped></style>
