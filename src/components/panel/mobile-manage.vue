<template>
  <div class="w-full py-5 px-5 flex justify-center items-center">
    <div></div>
    <div class="w-430px border b1 rounded">
      <div class="flex justify-between items-center textxs h-6">
        <div class="w-16 px-2">19.43</div>
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
          <card-render ref="cr" v-model:layout="layout" :col-num="12" />
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>
<script lang="tsx" setup>
import { ref } from 'vue'
import type { ICardRender, ICardView } from '@/components/panel/card'

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
.canvas {
  height: calc(100vh - 250px);
  max-height: 900px;
}
</style>
