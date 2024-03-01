<script lang="tsx" setup>
import { reactive, ref } from 'vue';
import type { ICardData, ICardRender, ICardView } from '@/components/panel/card';

const layout = ref<ICardView[]>([]);
const state = reactive({
  openAddPanel: false,
  cardData: null as null | ICardData
});

const editView = ref<ICardView | null>();
const cr = ref<ICardRender>();

const insertCard = (card: ICardData) => {
  if (editView.value) {
    editView.value.data = card;
  } else {
    cr.value?.addCard(card);
  }
  editView.value = null;
  state.openAddPanel = false;
};

const add = () => {
  editView.value = null;
  state.cardData = null;
  state.openAddPanel = true;
};
const edit = (view: ICardView) => {
  editView.value = view;
  state.cardData = view.data || null;
  state.openAddPanel = true;
};
</script>

<template>
  <div ref="box" class="w-full py-5 px-5">
    <div class="flex items-center justify-between px-10px border-b dark:border-gray-200/10 border-gray-200 pb-3">
      <div>
        <NButton>
          <SvgIcon icon="ep:back" class="text-lg mr-0.5" />
          返回
        </NButton>
      </div>
      <NSpace align="center">
        <NButton @click="add">
          <SvgIcon icon="material-symbols:add" class="text-lg mr-0.5" />
          添加组件
        </NButton>
        <NButton>
          <SvgIcon icon="material-symbols:settings-outline" class="text-lg mr-0.5" />
        </NButton>
        <NDivider vertical />
        <NButton>取消</NButton>
        <NButton>保存</NButton>
      </NSpace>
    </div>
    <div v-if="!layout.length" class="text-center dark:text-gray-400 text-gray-500 mt-20">
      <NEmpty description="暂未添加组件"></NEmpty>
    </div>
    <CardRender ref="cr" v-model:layout="layout" :col-num="12" :default-card-col="4" :row-height="30" @edit="edit" />
    <AddCard v-model:open="state.openAddPanel" :data="state.cardData" @save="insertCard" />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
</style>
