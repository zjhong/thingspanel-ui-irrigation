<template>
  <div class="w-full py-5 px-5 flex justify-between items-start">
    <div>
      <n-card class="operation-panel" content-style="padding:5px 15px">
        <n-tabs type="line" animated>
          <n-tab-pane name="builtin" tab="系统">
            <n-grid x-gap="10" y-gap="10" :cols="2" class="operation-tab">
              <n-grid-item v-for="item in PanelCards.builtin" :key="item.id">
                <div
                  class="rounded overflow-hidden cursor-pointer dark:border-gray-200/10 border border-gray-200 duration-200"
                  @mousedown.prevent=""
                  @click="insertCard(item)"
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
      <n-form-item label="页面标题">
        <n-input v-model:value="state.title"></n-input>
      </n-form-item>
      <template v-if="editView">
        <n-divider style="margin: 0">卡片配置</n-divider>
        <component :is="selectCard?.configForm" ref="configForm" v-model:config="state.cardConfig" />
        <n-button block type="primary" @click="submit">保存</n-button>
      </template>
    </n-card>
    <n-modal v-model:show="state.openConfig" preset="dialog" title="配置" size="huge" :style="{ width: '600px' }">
      <div class="mt-4">
        <component :is="selectCard?.configForm" ref="configForm" v-model:config="state.cardConfig" />
      </div>
      <template #action>
        <n-button @click="state.openConfig = false">取消</n-button>
        <n-button type="primary" @click="submit">添加卡片</n-button>
      </template>
    </n-modal>
  </div>
</template>
<script lang="tsx" setup>
import { onMounted, onUnmounted, reactive, ref, shallowRef } from 'vue'
import dayjs from 'dayjs'
import { usePanelStore } from '@/store'
import type { ICardDefine, ICardRender, ICardView } from '@/components/panel/card'
import { PanelCards } from '@/components/panel/index'

const selectCard = shallowRef<ICardDefine | null>()
const editView = ref<ICardView | null>()

const state = reactive({
  time: dayjs().format('HH:mm'),
  openConfig: false,
  cardConfig: {} as Record<string, any>,
  title: '设备看板'
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

const store = usePanelStore()
const configForm = ref<{ validate: () => Promise<any> }>()

const insertCard = (card: ICardDefine) => {
  editView.value = null
  if (card.configForm) {
    selectCard.value = card
    state.cardConfig = {}
    state.openConfig = true
  } else {
    cr.value?.addCard(card, {})
  }
}

const edit = (view: ICardView) => {
  const id = view.data?.cardId || ''
  selectCard.value = store.cardMap.get(id)
  editView.value = view
  state.cardConfig = view.data?.config || {}
}
const submit = async () => {
  if (editView.value) {
    if (configForm.value?.validate) await configForm.value?.validate()
    editView.value!.data!.config = state.cardConfig
  } else if (selectCard.value) {
    if (configForm.value?.validate) await configForm.value?.validate()
    cr.value?.addCard(selectCard.value!, state.cardConfig)
  }
  state.openConfig = false
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
