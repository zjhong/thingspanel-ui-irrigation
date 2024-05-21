<script setup lang="ts">
import {nextTick, reactive, ref} from 'vue';
import {NButton} from 'naive-ui';
import {useFullscreen} from '@vueuse/core';
import {useAppStore} from '@/store/modules/app';
import {useLayouts} from '@/components/tp-kan-ban/hooks/useLayouts';
import type {CardData, CardFormIns, CardView} from '@/components/tp-kan-ban/kan-ban';
import {PutBoard} from '@/service/api';

const formRef = ref<CardFormIns>();
const appStore = useAppStore();
const fullUI = ref();
const {isFullscreen, toggle} = useFullscreen(fullUI);
const props = defineProps<{ panelId: string }>();
const active = ref(false);
const showModal = ref(false);
const state = reactive<{ curCardData: null | CardView }>({
  curCardData: null
});
const activeType = ref<string>('plugins');
const {layouts, addItem, updateLayouts, panelDate} = useLayouts(props.panelId);
console.log(layouts);
const saveKanBan = async () => {
  if (!props.panelId) {
    window.NMessage.destroyAll();
    window.NMessage.error('无效的看板id');
  } else {
    const layoutJson = JSON.stringify(layouts.value);

    await PutBoard({
      id: props.panelId,
      config: layoutJson,
      name: panelDate.value?.name,
      home_flag: panelDate.value?.home_flag
    });
  }
};

function toggleModal(f) {
  showModal.value = f;
}

function selectCard(item: CardView) {
  toggleModal(true);
  state.curCardData = {
    ...item
  };
  nextTick(() => {
    formRef.value?.setCard(state.curCardData as CardView);
  });
}

const changeCurCardData = (data: CardData) => {
  const index = layouts.value.findIndex(i => i.data?.renderID === data.renderID);
  if (index === -1) return;
  updateLayouts(data, index);
};
</script>

<template>
  <div class="w-full flex-col">
    <div
      v-show="!appStore.fullContent"
      class="flex items-center justify-between border-b border-gray-200 p-0 dark:border-gray-200/10"
    >
      <KanBanHeader
        v-model:active="active"
        :toggle="toggle"
        :is-fullscreen="isFullscreen"
        :save-kan-ban="saveKanBan"
        :tittle="panelDate?.name"
        class="w-full"
      />
    </div>
    <div
      ref="fullUI"
      :class="!layouts.length ? 'flex-1 flex-col items-center justify-center' : 'flex-1'"
    >
      <KanBanRender :is-preview="false" :layout="layouts" :add-item="addItem" :select-card="selectCard"/>
      <n-drawer
        v-model:show="active"
        :width="236"
        placement="left"
        :show-mask="false"
        style="box-shadow: 0 8px 16px 0 rgba(156, 107, 255, 0.4)"
      >
        <n-drawer-content title="卡片列表" class="shadow-sm" closable>
          <KanBanCardList v-model:active-type="activeType"/>
        </n-drawer-content>
      </n-drawer>

      <n-modal v-model:show="showModal">
        <n-card style="width: 800px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <KanBanCardForm ref="formRef" @update="changeCurCardData"/>
          <n-space justify="center">
            <NButton type="primary" class="text-center" @click="showModal = false">完成</NButton>
          </n-space>
        </n-card>
      </n-modal>
    </div>
  </div>
</template>

<style scoped></style>
