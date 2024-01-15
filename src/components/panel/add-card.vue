<template>
  <n-drawer :width="600" :show="show" @update-show="emit('update:show', $event)">
    <n-drawer-content title="添加看板组件" closable>
      <n-tabs type="line" animated>
        <n-tab-pane name="builtin" tab="系统">
          <n-grid x-gap="10" y-gap="10" :cols="2">
            <n-grid-item v-for="item in PanelCards.builtin" :key="item.id">
              <div
                class="rounded overflow-hidden cursor-pointer dark:border-gray-200/10 border border-gray-200 duration-200"
                @mousedown.prevent=""
                @click="addCard(item)"
              >
                <div class="leading-8 font-medium text-center dark:bg-zinc-900">{{ item.title }}</div>
                <div>
                  <img :src="item.poster" alt="" class="w-full object-cover" />
                </div>
              </div>
            </n-grid-item>
          </n-grid>
        </n-tab-pane>
        <n-tab-pane name="device" tab="设备"></n-tab-pane>
        <n-tab-pane name="plugin" tab="插件"></n-tab-pane>
        <n-tab-pane name="chart" tab="图表"></n-tab-pane>
      </n-tabs>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import type { ICardDefine } from '@/components/panel/card'
import { PanelCards } from './index'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void
  (e: 'add-card', value: ICardDefine): void
}>()

const addCard = (item: ICardDefine) => {
  emit('add-card', item)
  emit('update:show', false)
}
</script>
