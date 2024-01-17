<template>
  <grid-layout
    :layout="layout"
    :col-num="colNum"
    :row-height="rowHeight"
    :auto-size="true"
    :margin="[10, 10]"
    style="width: 100%"
    @update:layout="data => emit('update:layout', data)"
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
          <n-icon class="cursor-pointer right-8 top-1 absolute cursor-pointer" @click="emit('edit', item)">
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
</template>
<script setup lang="ts">
import { GridItem, GridLayout } from 'vue3-drr-grid-layout'
import { usePanelStore } from '@/store'
import type { ICardDefine, ICardView } from '@/components/panel/card'
import './gird.css'
const props = defineProps<{
  layout: ICardView[]
  colNum: number
  defaultCardCol: number
  rowHeight: number
}>()

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

const emit = defineEmits<{
  (e: 'update:layout', layout: ICardView[] | any): void
  (e: 'edit', view: ICardView): void
}>()

defineExpose({
  addCard: (data: ICardDefine, config: Record<string, any>) => {
    const yList: number[] = []
    const layout = props.layout
    const layoutData = layout.sort((a, b) => {
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
    emit('update:layout', [
      ...layout,
      {
        x,
        y,
        w: props.defaultCardCol,
        h: 4,
        i: layoutData.length,
        data: {
          title: data.title,
          type: data.type,
          cardId: data.id,
          config
        }
      }
    ])
  }
})

const store = usePanelStore()
const findCardComponent = (id: string) => {
  return store.$state.cardMap.get(id)?.component || null
}

const removeLayout = (i: number) => {
  emit(
    'update:layout',
    props.layout.filter(item => item.i !== i)
  )
}
</script>
