<template>
  <div ref="box" class="w-full py-5 px-5">
    <div class="flex items-center justify-between px-10px border-b dark:border-gray-200/10 border-gray-200 pb-3">
      <div>
        <n-button>
          <svg-icon icon="ep:back" class="text-lg mr-0.5" />
          返回
        </n-button>
      </div>
      <n-space align="center">
        <n-button @click="state.openAddPanel = true">
          <svg-icon icon="material-symbols:add" class="text-lg mr-0.5" />
          添加组件
        </n-button>
        <n-button>
          <svg-icon icon="material-symbols:settings-outline" class="text-lg mr-0.5" />
        </n-button>
        <n-divider vertical />
        <n-button>取消</n-button>
        <n-button>保存</n-button>
      </n-space>
    </div>
    <div v-if="!layout.length" class="text-center dark:text-gray-400 text-gray-500 mt-20">
      <n-empty description="暂未添加组件"></n-empty>
    </div>
    <grid-layout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :auto-size="true"
      :margin="[10, 10]"
      style="width: 100%"
    >
      <template #default="{ gridItemProps }">
        <grid-item
          v-for="item in layout"
          :key="item.i"
          v-bind="gridItemProps"
          :min-h="2"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <n-card class="h-full w-full relative" content-style="padding: 0px">
            <n-icon class="cursor-pointer right-8 top-1 absolute cursor-pointer">
              <svg-icon icon="uil:setting" class="text-base" />
            </n-icon>
            <n-popconfirm
              :show-icon="false"
              :negative-button-props="{ size: 'tiny' }"
              :positive-button-props="{ size: 'tiny' }"
              :on-positive-click="() => removeLayout(item.i)"
            >
              <template #trigger>
                <n-icon class="cursor-pointer right-2 top-1 absolute cursor-pointer">
                  <svg-icon icon="material-symbols:delete-outline" class="text-base" />
                </n-icon>
              </template>
              <span>确认删除看板。</span>
            </n-popconfirm>

            <div class="p-4">
              <component :is="findCardComponent(item.data?.cardId || '')" :card="item.data" />
            </div>
          </n-card>
        </grid-item>
      </template>
    </grid-layout>
    <add-card v-model:show="state.openAddPanel" @add-card="insertCard" />
  </div>
</template>
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import { GridItem, GridLayout } from 'vue3-drr-grid-layout'
import './gird.css'
import { usePanelStore } from '@/store'
import type { ICardDefine, ICardView } from '@/components/panel/card'
const layout = ref<ICardView[]>([
  // { x: 0, y: 0, w: 2, h: 2, i: 0 },
  // { x: 2, y: 0, w: 2, h: 2, i: 1 },
  // { x: 4, y: 0, w: 4, h: 2, i: 2 },
  // { x: 0, y: 1, w: 6, h: 2, i: 3 }
])
const store = usePanelStore()
const state = reactive({
  openAddPanel: false
})
const findCardComponent = (id: string) => {
  return store.$state.builtinPanelsMap.get(id)?.component || null
}
const countSpace = (data: ICardView[], y: number) => {
  const cols = data.filter(d => d.y === y).sort((a, b) => (a.x > b.x ? 1 : -1))
  let start = 0
  for (const c of cols) {
    if (c.x - start > 0) {
      start += c.x - start
    }
    start += c.w
  }
  return start
}
const insertCard = (card: ICardDefine) => {
  const yList: number[] = []
  const layoutData = layout.value.sort((a, b) => {
    return a.y > b.y ? 1 : -1
  })
  layoutData.forEach(item => {
    if (!yList.includes(item.y)) yList.push(item.y)
  })
  let y = yList.shift() || 0
  let x = 0
  const max = yList[yList.length - 1] || 0
  while (y <= max) {
    const space = countSpace(layoutData, y)
    if (space <= 8) {
      x = space
      break
    } else {
      y = yList.shift() || y + 1
    }
  }
  layout.value.push({
    x,
    y,
    w: 4,
    h: 4,
    i: layoutData.length,
    data: {
      title: card.title,
      type: card.type,
      cardId: card.id,
      config: {}
    }
  })
}
const removeLayout = (i: number) => {
  layout.value = layout.value.filter(item => item.i !== i)
}
</script>
<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
</style>
