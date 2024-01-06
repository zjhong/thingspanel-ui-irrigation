<template>
  <div ref="box" class="w-full py-10 px-10">
    <div v-for="(item, i) in data.panels" :key="i" class="mb-16 relative" :style="{ height: item.height + 'px' }">
      <n-grid cols="24" x-gap="12" class="h-full">
        <n-grid-item v-for="p in item.panels" :key="p.id" :span="p.span" class="h-full duration-200">
          <div
            :class="{ ['panel-select']: data.selectItem === p, panel: data.selectItem !== p }"
            class="h-full relative duration-200 w-full"
            @click="data.selectItem = p"
          >
            <n-card content-style="padding: 10px" class="h-full">123</n-card>
            <div class="handle cursor-col-resize" @mousedown="dragItem($event, p, i)" />
          </div>
        </n-grid-item>
      </n-grid>
      <div
        class="flex items-center w-full absolute -bottom-9 h-2 hover:cursor-row-resize group"
        @mousedown="dragLine($event, i)"
      >
        <div
          class="duration-200 border-t border-dashed border-gray-400 h-0 flex-1 dark:border-gray-400 dark:group-hover:border-gray-200"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
const box = ref<HTMLDivElement>()

interface PanelItem {
  span: number
  id: number
}

interface Line {
  height: number
  panels: PanelItem[]
}

const data = reactive({
  selectItem: null as null | PanelItem,
  panels: [
    {
      height: 200,
      panels: [
        {
          span: 4,
          id: 1
        },
        {
          span: 6,
          id: 2
        }
      ]
    },
    {
      height: 200,
      panels: [
        {
          span: 4,
          id: 3
        }
      ]
    }
  ] as Line[]
})

const dragLine = (e: MouseEvent, line: number) => {
  e.stopPropagation()
  const startY = e.clientY
  const startHeight = data.panels[line].height
  const move = (em: MouseEvent) => {
    const moveY = em.clientY - startY
    const height = startHeight + moveY
    data.panels[line].height = height < 50 ? 50 : height
  }
  window.addEventListener('mousemove', move)
  window.addEventListener(
    'mouseup',
    () => {
      window.removeEventListener('mousemove', move)
    },
    { once: true }
  )
}

const dragItem = (e: MouseEvent, item: PanelItem, line: number) => {
  e.stopPropagation()
  e.preventDefault()
  const startX = e.clientX
  const startSpan = item.span
  const spanWidth = (box.value!.clientWidth - 80) / 24
  const maxSpan = 24 - data.panels[line].panels.filter(p => p !== item).reduce((a, b) => a + b.span, 0)
  const move = (em: MouseEvent) => {
    let moveSpan = Math.round((em.clientX - startX) / spanWidth) + startSpan
    if (moveSpan < 1) moveSpan = 1
    if (moveSpan > maxSpan) moveSpan = maxSpan
    item.span = moveSpan
  }
  window.addEventListener('mousemove', move)
  window.addEventListener(
    'mouseup',
    () => {
      window.removeEventListener('mousemove', move)
    },
    { once: true }
  )
}
</script>
<style lang="scss" scoped>
.panel-select {
  @apply border border-blue-500 rounded;
  .handle {
    @apply w-2 h-2 rounded-full bg-white absolute -right-1 top-1/2 -mt-1;
  }
}

.panel {
  @apply border border-transparent;
}
</style>
