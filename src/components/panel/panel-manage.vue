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
    <card-render ref="cr" v-model:layout="layout" :col-num="12" :default-card-col="4" :row-height="30" @edit="edit" />
    <add-card v-model:show="state.openAddPanel" @add-card="insertCard" />
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
import { reactive, ref, shallowRef } from 'vue'
import { usePanelStore } from '@/store'
import type { ICardDefine, ICardRender, ICardView } from '@/components/panel/card'
const layout = ref<ICardView[]>([])
const state = reactive({
  openAddPanel: false,
  openConfig: false,
  cardConfig: {} as Record<string, any>
})

const selectCard = shallowRef<ICardDefine | null>()
const editView = ref<ICardView | null>()
const cr = ref<ICardRender>()
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
    state.openAddPanel = false
  }
}

const edit = (view: ICardView) => {
  const id = view.data?.cardId || ''
  selectCard.value = store.cardMap.get(id)
  editView.value = view
  state.cardConfig = view.data?.config || {}
  state.openConfig = true
}
const submit = async () => {
  if (editView.value) {
    if (configForm.value?.validate) await configForm.value?.validate()
    editView.value!.data!.config = state.cardConfig
  } else if (selectCard.value) {
    if (configForm.value?.validate) await configForm.value?.validate()
    cr.value?.addCard(selectCard.value!, state.cardConfig)
    state.openAddPanel = false
  }
  state.openConfig = false
}
</script>
<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
</style>
