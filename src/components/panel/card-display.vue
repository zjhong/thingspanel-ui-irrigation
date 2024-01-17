<template>
  <n-grid x-gap="10" y-gap="10" :cols="cols" class="operation-tab">
    <n-grid-item v-for="item in cards" :key="item.id">
      <div
        class="rounded overflow-hidden cursor-pointer dark:border-gray-200/10 border border-gray-200 duration-200"
        @mousedown.prevent=""
        @click="add(item)"
      >
        <div class="leading-8 font-medium text-center dark:bg-zinc-900">{{ item.title }}</div>
        <div>
          <img :src="item.poster" alt="" class="w-full object-cover" />
        </div>
      </div>
    </n-grid-item>
  </n-grid>
</template>
<script setup lang="ts">
import type { ICardDefine } from '@/components/panel/card'

defineProps<{
  cards: ICardDefine[]
  cols: number
}>()

const emit = defineEmits<{
  (e: 'add-card', value: ICardDefine): void
}>()

const add = (card: ICardDefine) => {
  emit('add-card', card)
}
</script>
