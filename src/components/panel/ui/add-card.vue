<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import type { ICardData, ICardDefine, ICardFormIns } from '@/components/panel/card';
import { PanelCards } from '@/components/panel';
import { $t } from '~/src/locales';

const props = defineProps<{
  open: boolean;
  data?: ICardData | null;
}>();
const formRef = ref<ICardFormIns>();

const tabValue = ref('builtin');

const tabList = [
  { tab: '系统', type: 'builtin' },
  { tab: '设备', type: 'device' },
  { tab: '插件', type: 'plugin' },
  { tab: '图表', type: 'chart' }
];
const state = reactive({
  curCardData: null as null | Record<string, any>
});
// $emit是内置变量 不可以使用$emit 作为变量名
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'save', value: any): void;
}>();
const save = () => {
  emit('update:open', false);

  if (state && state.curCardData && state.curCardData.dataSource && state.curCardData.dataSource.deviceSource) {
    state.curCardData.dataSource.deviceSource = state.curCardData.dataSource.deviceSource.filter(
      item => Object.keys(item).length > 0
    );
    if (
      state.curCardData.dataSource.deviceCount >= 1 &&
      state.curCardData.dataSource.deviceSource.length > state.curCardData.dataSource.deviceCount
    ) {
      state.curCardData.dataSource.deviceSource.splice(state.curCardData.dataSource.deviceCount);
      console.log(state.curCardData.dataSource.deviceCount, ':', state.curCardData.dataSource.deviceSource);
    }
    if (state.curCardData.dataSource.deviceSource.length === 0) {
      state.curCardData.dataSource.deviceSource = [{}];
    }
  }

  emit('save', JSON.parse(JSON.stringify(state.curCardData)));
};

const copy = (data: object) => JSON.parse(JSON.stringify(data));
watch(props, pr => {
  if (pr.open) {
    if (pr.data) {
      state.curCardData = {
        cardId: pr.data?.cardId,
        type: pr.data?.type,
        title: pr.data?.title,
        config: copy(pr.data?.config || {}),
        basicSettings: copy(pr.data?.basicSettings || {}),
        dataSource: copy(pr.data?.dataSource || {})
      };
    } else {
      state.curCardData = null;
    }
    setTimeout(() => {
      formRef.value?.setCard(state.curCardData as any);
    }, 30);
  }
});
const selectCard = (item: ICardDefine) => {
  state.curCardData = {
    cardId: item.id,
    type: item.type,
    title: item.title,
    config: item.preset?.config || {},
    basicSettings: item.preset?.basicSettings || {},
    dataSource: item.preset?.dataSource || {
      origin: 'system',
      systemSource: [{}],
      deviceSource: [{}]
    }
  };
  console.log(1);
  formRef.value?.setCard(state.curCardData as any);
  console.log(2);
};

onMounted(() => {
  tabValue.value = props?.data?.type || 'builtin';
});
</script>

<template>
  <NModal
    :show="open"
    preset="dialog"
    title="配置"
    size="huge"
    :style="{ maxWidth: '1200px', width: 'calc(100vw - 100px)', minHeight: 'calc(100vh - 100px)' }"
    @close="emit('update:open', false)"
    @mask-click="emit('update:open', false)"
  >
    <div class="h-[calc(100vh_-_150px)] flex">
      <div class="mr-2 h-full flex-center flex-1 justify-center">
        <div v-if="!state.curCardData?.cardId" class="mt-32">
          <NEmpty description="请选择要添加的卡片"></NEmpty>
        </div>

        <div
          v-if="state.curCardData?.cardId"
          class="mr-4 mt-2 h-full w-full flex flex-col justify-center bg-[#f6f9f8] dark:bg-[#101014]"
        >
          <div id="panel_view" class="w-full overflow-y-auto p-4">
            <CardItem :data="state.curCardData as any" />
          </div>
        </div>
      </div>
      <div class="m-0 h-full w-400px p-0">
        <n-split direction="vertical">
          <template #1>
            <NTabs
              type="line"
              default-value="builtin"
              :value="tabValue"
              animated
              class="h-full"
              @update:value="value => (tabValue = value)"
            >
              <NTabPane v-for="item1 in tabList" :key="item1.type" class="h-full" :name="item1.type" :tab="item1.tab">
                <n-scrollbar style="height: 100%">
                  <n-grid :x-gap="10" :y-gap="10" :cols="2">
                    <n-gi v-for="item in PanelCards[item1.type]" :key="item.id">
                      <div
                        class="w-195px cursor-pointer overflow-hidden border rounded p-2px duration-200"
                        :style="
                          item.id === state?.curCardData?.cardId ? 'border-color: #2d3d88' : 'border-color: #f6f9f8'
                        "
                        @mousedown.prevent=""
                        @click="selectCard(item)"
                      >
                        <div class="text-center font-medium leading-8 dark:bg-zinc-900">{{ $t(item.title) }}</div>
                        <div class="h-120px w-full">
                          <img :src="item.poster" alt="" style="width: 100%; height: 100%; object-fit: contain" />
                        </div>
                      </div>
                    </n-gi>
                  </n-grid>
                </n-scrollbar>
              </NTabPane>
            </NTabs>
            <div style="height: 8px"></div>
          </template>
          <template #2>
            <div class="mt-4 h-full flex-col justify-start">
              <CardForm ref="formRef" @update="(data: any) => (state.curCardData = data)" />
            </div>
          </template>
        </n-split>
      </div>
    </div>

    <div class="mt-4 flex flex-center border-t">
      <div class="mt-4">
        <NButton class="mr-4" @click="emit('update:open', false)">取消</NButton>
        <NButton type="primary" @click="save">{{ data ? '编辑卡片' : '添加卡片' }}</NButton>
      </div>
    </div>
  </NModal>
</template>

<style scoped>
/* 滚动条的宽度 */
#panel_view::-webkit-scrollbar {
  width: 4px;
}

/* 滚动条的轨道 */
#panel_view::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 滚动条的滑块 */
#panel_view::-webkit-scrollbar-thumb {
  background: #888;
}

/* 滚动条的滑块：鼠标悬停 */
#panel_view::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
