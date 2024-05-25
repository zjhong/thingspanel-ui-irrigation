<script setup lang="ts">
import sceneLinkage from '@/views/automation/scene-linkage/index.vue';

defineProps<{
  // eslint-disable-next-line vue/prop-name-casing
  config_id: string;
}>();
</script>

<template>
  <NCard>
    <div class="h-500px flex-center flex-col">
      <!--      <n-empty :description="$t('common.nodata')"></n-empty>-->
      <sceneLinkage :device_config_id="config_id" />
    </div>
  </NCard>
</template>

<style scoped></style>
