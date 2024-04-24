<script lang="tsx" setup>
import { onMounted, reactive, ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { router } from '@/router';
import type { ICardData, ICardRender, ICardView } from '@/components/panel/card';
import { PutBoard, getBoard } from '@/service/api';
import { useAppStore } from '@/store/modules/app';

const props = defineProps<{ panelId: string }>();
const panelDate = ref<Panel.Board>();
const cr = ref<ICardRender>();
const fullui = ref();
const { isFullscreen, toggle } = useFullscreen(fullui);
const appStore = useAppStore();
const layout = ref<ICardView[]>([]);
const fetchBroad = async () => {
  const { data } = await getBoard(props.panelId);
  if (data) {
    panelDate.value = data;
    if (data.config) {
      const configJson = JSON.parse(data.config);
      layout.value = [...configJson, ...layout.value];
    }
  }
};

const state = reactive({
  openAddPanel: false,
  cardData: null as null | ICardData
});

const editView = ref<ICardView | null>();

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

  await PutBoard({
    id: props.panelId,
    config: layoutJson,
    name: panelDate.value?.name,
    home_flag: panelDate.value?.home_flag
  });
};

onMounted(fetchBroad);
</script>

<template>
  <div class="w-full px-5 py-5">
    <div
      v-show="!appStore.fullContent"
      class="flex items-center justify-between border-b border-gray-200 px-10px pb-3 dark:border-gray-200/10"
    >
      <div>
        <NButton @click="router.go(-1)">
          <SvgIcon icon="ep:back" class="mr-0.5 text-lg" />
          返回
        </NButton>
      </div>
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
        <FullScreen
          :full="isFullscreen"
          @click="
            () => {
              toggle();
            }
          "
        />
      </NSpace>
    </div>
    <div
      ref="fullui"
      :class="!layout.length ? 'h-full flex-col items-center justify-center bg-white' : 'h-full  bg-white'"
    >
      <div v-if="!layout.length" class="text-center text-gray-500 dark:text-gray-400">
        <NEmpty description="暂未添加组件"></NEmpty>
      </div>

      <CardRender ref="cr" v-model:layout="layout" :col-num="12" :default-card-col="4" :row-height="85" @edit="edit" />
    </div>
    <AddCard v-model:open="state.openAddPanel" :data="state.cardData" @save="insertCard" />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
</style>
