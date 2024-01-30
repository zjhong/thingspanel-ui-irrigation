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
        <n-button @click="add">
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
    <add-card v-model:open="state.openAddPanel" :data="state.cardData" @save="insertCard" />
  </div>
</template>
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import type { ICardData, ICardRender, ICardView } from '@/components/panel/card'

const layout = ref<ICardView[]>([])
const state = reactive({
  openAddPanel: false,
  cardData: null as null | ICardData
})

const editView = ref<ICardView | null>()
const cr = ref<ICardRender>()

const insertCard = (card: ICardData) => {
  if (editView.value) {
    editView.value.data = card
  } else {
    cr.value?.addCard(card)
  }
  editView.value = null
  state.openAddPanel = false
}

const add = () => {
  editView.value = null
  state.cardData = null
  state.openAddPanel = true
}
const edit = (view: ICardView) => {
  editView.value = view
  state.cardData = view.data || null
  state.openAddPanel = true
}
</script>
<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
</style>
