<script lang="ts" setup>
import { inject } from 'vue';
import type { IConfigCtx } from '@/components/panel/card';

const ctx = inject<IConfigCtx>('config-ctx')!;
</script>

<template>
  <NForm :model="ctx.config"></NForm>
</template>
