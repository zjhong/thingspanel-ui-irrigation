<script lang="tsx" setup>
import { onMounted, reactive, ref } from 'vue';
import type { ICardData, ICardRender, ICardView } from '@/components/panel/card';
import { useAppStore } from '@/store/modules/app';
import AddTemplateCard from './ui/add-template-card.vue';
import CardTemplateRender from './ui/card-template-render.vue';

const props = defineProps<{ templateId: string }>();

const appStore = useAppStore();
const layout = ref<ICardView[]>([]);
const fetchBroad = async () => {
  console.log(props.templateId);
  // const {data} = await getBoard(props.panelId);
  // if (data) {
  //   panelDate.value = data;
  //   if (data.config) {
  //     const configJson = JSON.parse(data.config);
  //     layout.value = [...configJson, ...layout.value];
  //   }
  // }
};

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

const savePanel = async () => {
  const layoutJson = JSON.stringify(layout.value);
  console.log(layoutJson);
};
onMounted(fetchBroad);
</script>

<template>
  <div class="w-full px-5 py-5">
    <div
      v-show="!appStore.fullContent"
      class="flex items-center justify-between border-b border-gray-200 px-10px pb-3 dark:border-gray-200/10"
    >
      <NSpace align="center">
        <NButton @click="add">
          <SvgIcon icon="material-symbols:add" class="mr-0.5 text-lg" />
          添加组件
        </NButton>
        <!--        <NButton>-->
        <!--          <SvgIcon icon="material-symbols:settings-outline" class="mr-0.5 text-lg" />-->
        <!--        </NButton>-->
        <NDivider vertical />
        <!--        <NButton>取消</NButton>-->
        <NButton @click="savePanel">保存</NButton>
      </NSpace>
    </div>
    <div v-if="!layout.length" class="mt-20 text-center text-gray-500 dark:text-gray-400">
      <NEmpty description="暂未添加组件"></NEmpty>
    </div>
    <CardTemplateRender
      ref="cr"
      v-model:layout="layout"
      :col-num="12"
      :default-card-col="4"
      :row-height="65"
      @edit="edit"
    />
    <AddTemplateCard v-model:open="state.openAddPanel" :data="state.cardData" @save="insertCard" />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
</style>
