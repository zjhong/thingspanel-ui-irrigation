<template>
  <div class="w-full py-5 px-5 flex justify-between items-start">
    <div class="operation-panel">
      <n-card>
        <n-tabs type="line" animated>
          <n-tab-pane name="builtin" tab="系统">
            <card-display :cards="PanelCards.builtin" :cols="2" />
          </n-tab-pane>
          <n-tab-pane name="device" tab="设备"></n-tab-pane>
          <n-tab-pane name="plugin" tab="插件"></n-tab-pane>
          <n-tab-pane name="chart" tab="图表"></n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
    <div class="w-430px border b1 rounded">
      <div class="flex justify-between items-center textxs h-6">
        <div class="w-16 px-2">{{ state.time }}</div>
        <div class="flex-1 text-center"></div>
        <div class="w-16 px-2 flex justify-end">
          <svg-icon icon="mingcute:signal-fill" class="mr-2" />
          <svg-icon icon="material-symbols:wifi" />
        </div>
      </div>
      <div class="text-base flex justify-between items-center h-10 border-b b1">
        <div class="w-16 text-lg pl-3 font-medium">
          {{ '<' }}
        </div>
        <div>设备看板</div>
        <div class="w-16"></div>
      </div>
      <div class="canvas overflow-y-auto">
        <div v-if="!layout.length" class="text-center dark:text-gray-400 text-gray-500 mt-20">
          <n-empty description="暂未添加组件"></n-empty>
        </div>
        <div>
          <card-render ref="cr" v-model:layout="layout" :col-num="4" :default-card-col="2" :row-height="30" />
        </div>
      </div>
    </div>
    <div class="operation-panel"></div>
  </div>
</template>
<script lang="tsx" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import type { ICardRender, ICardView } from '@/components/panel/card'
import { PanelCards } from '@/components/panel/index'
import CardDisplay from '@/components/panel/card-display.vue'

const state = reactive({
  time: dayjs().format('HH:mm')
})
let timer = 0
onMounted(() => {
  timer = window.setInterval(() => {
    state.time = dayjs().format('HH:mm')
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

const layout = ref<ICardView[]>([])
const cr = ref<ICardRender>()
// const insertCard = (card: ICardDefine) => {
//   cr.value?.addCard(card, {})
// }
</script>
<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
.operation-panel {
  width: calc((100vw - 730px) / 2);
  max-width: 420px;
}
.operation-tab {
  height: calc(100vh - 280px);
  overflow-y: auto;
}
.canvas {
  height: calc(100vh - 250px);
  max-height: 900px;
}
</style>
