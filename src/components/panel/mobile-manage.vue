<template>
  <div class="w-full py-5 px-5 flex justify-between items-start">
    <div>
      <n-card class="operation-panel" content-style="padding:5px 15px">
        <n-tabs type="line" animated>
          <n-tab-pane name="builtin" tab="系统">
            <n-grid x-gap="10" y-gap="10" :cols="2">
              <n-grid-item v-for="item in PanelCards.builtin" :key="item.id">
                <div
                  class="rounded overflow-hidden cursor-pointer dark:border-gray-200/10 border border-gray-200 duration-200"
                  @mousedown.prevent=""
                  @click="openConfig(item)"
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
          <n-tab-pane name="chart" tab="图表">
            <n-grid x-gap="10" y-gap="10" :cols="2" class="operation-tab">
              <n-grid-item v-for="item in PanelCards.chart" :key="item.id">
                <div
                  class="rounded overflow-hidden cursor-pointer dark:border-gray-200/10 border border-gray-200 duration-200"
                  @mousedown.prevent=""
                  @click="openConfig(item)"
                >
                  <div class="h-8 items-center font-medium text-center dark:bg-zinc-900 flex justify-center px-2">
                    <div class="text-sm flex-1 truncate">
                      {{ item.title }}
                    </div>
                  </div>
                  <div>
                    <img :src="item.poster" alt="" class="w-full object-cover" />
                  </div>
                </div>
              </n-grid-item>
            </n-grid>
          </n-tab-pane>
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
        <div>{{ state.title }}</div>
        <div class="w-16"></div>
      </div>
      <div class="canvas overflow-y-auto">
        <div v-if="!layout.length" class="text-center dark:text-gray-400 text-gray-500 mt-20">
          <n-empty description="暂未添加组件"></n-empty>
        </div>
        <div>
          <card-render
            ref="cr"
            v-model:layout="layout"
            :col-num="4"
            :default-card-col="2"
            :row-height="30"
            @edit="edit"
          />
        </div>
      </div>
    </div>
    <n-card class="operation-panel" content-style="15px">
      <div :class="`${editView ? '' : 'hidden'}`">
        <card-form ref="formRef" mobile @update="update" />
      </div>
      <div v-if="!editView" class="mt-20">
        <n-empty description="选择卡片"></n-empty>
      </div>
    </n-card>
    <add-card v-model:open="state.openConfig" :data="state.initialData" @save="insertCard" />
  </div>
</template>
<script lang="tsx" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import type { ICardData, ICardDefine, ICardFormIns, ICardRender, ICardView } from '@/components/panel/card'
import { PanelCards } from '@/components/panel/index'
const formRef = ref<ICardFormIns>()
const editView = ref<ICardView | null>()
const state = reactive({
  time: dayjs().format('HH:mm'),
  openConfig: false,
  cardConfig: {} as Record<string, any>,
  title: '设备看板',
  initialData: null as any,
  selectedView: null as null | ICardView
})
let timer = 0
onMounted(() => {
  timer = window.setInterval(() => {
    state.time = dayjs().format('HH:mm')
  }, 1000)
})
onUnmounted(() => clearInterval(timer))
const openConfig = (item: ICardDefine) => {
  state.initialData = {
    title: item.title,
    cardId: item.id,
    type: item.type,
    config: item.preset?.config || {},
    basicSettings: item.preset?.basicSettings || {},
    dataSource: item.preset?.dataSource || {}
  }
  state.openConfig = true
  editView.value = null
}
const layout = ref<ICardView[]>([])
const cr = ref<ICardRender>()

const insertCard = (data: ICardData) => {
  cr.value?.addCard(data)
}

const edit = (view: ICardView) => {
  editView.value = view
  state.initialData = view.data
  formRef.value?.setCard(state.initialData)
}
const update = (data: ICardData) => {
  if (editView.value) {
    editView.value.data = data
  }
}
</script>
<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
.operation-panel {
  width: calc((100vw - 730px) / 2);
  max-width: 420px;
  height: calc(100vh - 184px);
}
.operation-tab {
  overflow-y: auto;
  height: calc(100vh - 280px);
}
.canvas {
  height: calc(100vh - 250px);
  max-height: 900px;
}
</style>
