<template>
  <div>测试 {{ card.type }}</div>
</template>
<script lang="ts" setup>
import type { ICardData } from '@/components/panel/card'

defineProps<{
  card: ICardData
}>()
</script>
