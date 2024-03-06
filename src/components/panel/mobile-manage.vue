<script lang="tsx" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import type { ICardData, ICardDefine, ICardFormIns, ICardRender, ICardView } from '@/components/panel/card';
import { PanelCards } from '@/components/panel/index';

const formRef = ref<ICardFormIns>();
const editView = ref<ICardView | null>();
const state = reactive({
  time: dayjs().format('HH:mm'),
  openConfig: false,
  cardConfig: {} as Record<string, any>,
  title: '设备看板',
  initialData: null as any,
  selectedView: null as null | ICardView
});
let timer: number;

onMounted(() => {
  timer = window.setInterval(() => {
    state.time = dayjs().format('HH:mm');
  }, 1000);
});

onUnmounted(() => clearInterval(timer));

const openConfig = (item: ICardDefine) => {
  state.initialData = {
    title: item.title,
    cardId: item.id,
    type: item.type,
    config: item.preset?.config || {},
    basicSettings: item.preset?.basicSettings || {},
    dataSource: item.preset?.dataSource || {}
  };
  state.openConfig = true;
  editView.value = null;
};

const layout = ref<ICardView[]>([]);
const cr = ref<ICardRender>();

const insertCard = (data: ICardData) => {
  cr.value?.addCard(data);
};

const edit = (view: ICardView) => {
  editView.value = view;
  state.initialData = view.data;
  formRef.value?.setCard(state.initialData);
};

const update = (data: ICardData) => {
  if (editView.value) {
    editView.value.data = data;
  }
};
</script>

<template>
  <div class="w-full flex items-start justify-between px-5 py-5">
    <div>
      <NCard class="operation-panel" content-style="padding:5px 15px">
        <NTabs type="line" animated>
          <NTabPane name="builtin" tab="系统">
            <NGrid x-gap="10" y-gap="10" :cols="2">
              <NGridItem v-for="item in PanelCards.builtin" :key="item.id">
                <div
                  class="cursor-pointer overflow-hidden border border-gray-200 rounded duration-200 dark:border-gray-200/10"
                  @mousedown.prevent=""
                  @click="openConfig(item)"
                >
                  <div class="text-center font-medium leading-8 dark:bg-zinc-900">{{ item.title }}</div>
                  <div>
                    <img :src="item.poster" alt="" class="w-full object-cover" />
                  </div>
                </div>
              </NGridItem>
            </NGrid>
          </NTabPane>
          <NTabPane name="device" tab="设备"></NTabPane>
          <NTabPane name="plugin" tab="插件"></NTabPane>
          <NTabPane name="chart" tab="图表">
            <NGrid x-gap="10" y-gap="10" :cols="2" class="operation-tab">
              <NGridItem v-for="item in PanelCards.chart" :key="item.id">
                <div
                  class="cursor-pointer overflow-hidden border border-gray-200 rounded duration-200 dark:border-gray-200/10"
                  @mousedown.prevent=""
                  @click="openConfig(item)"
                >
                  <div class="h-8 flex items-center justify-center px-2 text-center font-medium dark:bg-zinc-900">
                    <div class="flex-1 truncate text-sm">
                      {{ item.title }}
                    </div>
                  </div>
                  <div>
                    <img :src="item.poster" alt="" class="w-full object-cover" />
                  </div>
                </div>
              </NGridItem>
            </NGrid>
          </NTabPane>
        </NTabs>
      </NCard>
    </div>
    <div class="b1 w-430px border rounded">
      <div class="textxs h-6 flex items-center justify-between">
        <div class="w-16 px-2">{{ state.time }}</div>
        <div class="flex-1 text-center"></div>
        <div class="w-16 flex justify-end px-2">
          <SvgIcon icon="mingcute:signal-fill" class="mr-2" />
          <SvgIcon icon="material-symbols:wifi" />
        </div>
      </div>
      <div class="b1 h-10 flex items-center justify-between border-b text-base">
        <div class="w-16 pl-3 text-lg font-medium"></div>
        <div>{{ state.title }}</div>
        <div class="w-16"></div>
      </div>
      <div class="canvas overflow-y-auto">
        <div v-if="!layout.length" class="mt-20 text-center text-gray-500 dark:text-gray-400">
          <NEmpty description="暂未添加组件"></NEmpty>
        </div>
        <div>
          <CardRender
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
    <NCard class="operation-panel" content-style="15px">
      <div :class="`${editView ? '' : 'hidden'}`">
        <CardForm ref="formRef" mobile @update="update" />
      </div>
      <div v-if="!editView" class="mt-20">
        <NEmpty description="选择卡片"></NEmpty>
      </div>
    </NCard>
    <AddCard v-model:open="state.openConfig" :data="state.initialData" @save="insertCard" />
  </div>
</template>

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
