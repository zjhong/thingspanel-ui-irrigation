<script setup lang="ts">
import { ref } from 'vue';

const widths = ref(['flex-[55]', 'flex-[45]', 'flex-[0]']);

const changeWidths = (count: number) => {
  if (count === 1) {
    widths.value = ['flex-[0]', 'flex-[55]', 'flex-[45]'];
  } else {
    widths.value = ['flex-[55]', 'flex-[45]', 'flex-[0]'];
  }
};
</script>

<template>
  <n-flex>
    <div :class="widths[0] + ' h-400 bg-#ff0000 overflow-hidden'" @click="changeWidths(2)">
      9999999999999999999999999999999999999999
    </div>
    <div :class="widths[1] + ' h-400 bg-#ff0000 overflow-hidden'">999999999999999999</div>
    <div :class="widths[2] + ' h-400 bg-#ff0000 overflow-hidden'" @click="changeWidths(1)">999999999999999999999</div>
  </n-flex>
</template>
