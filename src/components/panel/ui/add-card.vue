<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { ICardData, ICardDefine, ICardFormIns } from '@/components/panel/card';
import { PanelCards } from '@/components/panel';

const formRef = ref<ICardFormIns>();
const state = reactive({
  curCardData: null as null | Record<string, any>
});
const $emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'save', value: any): void;
}>();
const save = () => {
  $emit('update:open', false);
  $emit('save', JSON.parse(JSON.stringify(state.curCardData)));
};

const props = defineProps<{
  open: boolean;
  data?: ICardData | null;
}>();
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
  formRef.value?.setCard(state.curCardData as any);
};
</script>

<template>
  <NModal
    :show="open"
    preset="dialog"
    title="配置"
    size="huge"
    :style="{ maxWidth: '1200px', width: !data ? 'calc(100vw - 100px)' : '700px', minHeight: 'calc(100vh - 100px)' }"
    @close="$emit('update:open', false)"
    @mask-click="$emit('update:open', false)"
  >
    <div class="flex">
      <div class="flex-1">
        <div v-if="!state.curCardData?.cardId" class="mt-32">
          <NEmpty description="请选择要添加的卡片"></NEmpty>
        </div>
        <div :class="!data ? 'mr-10' : ''">
          <div
            v-if="state.curCardData?.cardId"
            class="mt-2 h-[230px] flex items-center justify-center overflow-y-auto rounded bg-[#f6f9f8] dark:bg-[#101014]"
          >
            <div class="w-[300px]">
              <CardItem :data="state.curCardData as any" />
            </div>
          </div>
          <div class="pt-5">
            <div class="h-[calc(100vh_-_450px)]">
              <CardForm ref="formRef" @update="(data: any) => (state.curCardData = data)" />
            </div>
            <div
              class="flex justify-center justify-center border-t border-t border-gray-200 pt-3 space-x-5 dark:border-gray-200/10"
            >
              <NButton @click="$emit('update:open', false)">取消</NButton>
              <NButton type="primary" @click="save">添加卡片</NButton>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!data" class="w-[400px]">
        <NTabs type="line" animated>
          <NTabPane name="builtin" tab="系统">
            <NGrid x-gap="10" y-gap="10" :cols="2">
              <NGridItem v-for="item in PanelCards.builtin" :key="item.id">
                <div
                  class="cursor-pointer overflow-hidden border border-gray-200 rounded duration-200 dark:border-gray-200/10"
                  @mousedown.prevent=""
                  @click="selectCard(item)"
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
            <NGrid x-gap="10" y-gap="10" :cols="2">
              <NGridItem v-for="item in PanelCards.chart" :key="item.id">
                <div
                  class="cursor-pointer overflow-hidden border border-gray-200 rounded duration-200 dark:border-gray-200/10"
                  @mousedown.prevent=""
                  @click="selectCard(item)"
                >
                  <div class="text-center font-medium leading-8 dark:bg-zinc-900">{{ item.title }}</div>
                  <div>
                    <img :src="item.poster" alt="" class="w-full object-cover" />
                  </div>
                </div>
              </NGridItem>
            </NGrid>
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </NModal>
</template>
