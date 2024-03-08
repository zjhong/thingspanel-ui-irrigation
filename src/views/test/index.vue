<script setup lang="tsx">
import { ref } from 'vue';

const message = ref('你好');
</script>

<template>
  <div>
    {{ message }}
  </div>
</template>

<style scoped></style>
