<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { GridItem, GridLayout } from 'grid-layout-plus';
import { throttle } from '@vexip-ui/utils';
// eslint-disable-next-line vue/prefer-import-from-vue
import type { UnwrapRefSimple } from '@vue/reactivity';
import type { CardView } from '@/components/tp-kan-ban/kan-ban';
import { KANBANCOLNUM, KANBANROWHEIGHT } from '@/constants/common';
import { KanBanCards } from '@/card2';
import { $t } from '@/locales';
import { deviceTemplateSelect } from '@/service/api';
import type { CardType } from '@/card2/card';

defineOptions({ name: 'KanBanRender' });
const active = defineModel<boolean>('active', { required: true, default: false });
defineProps<{ isPreview?: boolean }>();
const layout = defineModel<CardView[]>('layout', { required: true });
const deviceSelectId = ref<string>('');
const deviceOptions = ref<UnwrapRefSimple<any>[]>();

const layoutKey = ref(0);

const getDeviceOptions = async () => {
  const { data, error } = await deviceTemplateSelect();
  if (!error) {
    deviceOptions.value = data;
  }
};

const selectDevice = (v, o) => {
  console.log(v, o);
  const cardIdArr = ['card_chart_demo1'];
  KanBanCards.device = KanBanCards.chart.filter(i => i.id === cardIdArr[0]);
};

const value = ref<CardType | 'device'>('plugins');
const options = [
  { label: '系统', value: 'system' },
  { label: '插件', value: 'plugins' },
  { label: '设备', value: 'device' },
  { label: '图表', value: 'chart' }
];

const wrapper = ref<HTMLElement>();
const gridLayout = ref<InstanceType<typeof GridLayout>>();

const mouseAt = { x: -1, y: -1 };
const syncMousePosition = (event: MouseEvent) => {
  mouseAt.x = event.clientX;
  mouseAt.y = event.clientY;
};
const drag = throttle(() => {
  const parentRect = wrapper.value?.getBoundingClientRect();
  // eslint-disable-next-line no-useless-return
  if (!parentRect || !gridLayout.value) return;
}, 100);

function dragEnd(n) {
  nextTick(() => {
    const parentRect = wrapper.value?.getBoundingClientRect();
    if (!parentRect || !gridLayout.value) return;

    const mouseInGrid =
      mouseAt.x > parentRect.left &&
      mouseAt.x < parentRect.right &&
      mouseAt.y > parentRect.top &&
      mouseAt.y < parentRect.bottom;

    if (mouseInGrid) {
      const newId = `new-${n.id}-${Date.now()}`;
      layout.value.push({
        x: mouseAt.x - parentRect.left,
        y: mouseAt.y - parentRect.top,
        w: 2,
        h: 2,
        i: newId
      });
      // eslint-disable-next-line no-plusplus
      layoutKey.value++; // Increment key to force re-render
    }

    console.log('Updated layout:', layout.value);
  });
}

function removeItem(id: string) {
  const index = layout.value.findIndex(item => item.i === id);
  if (index > -1) {
    layout.value.splice(index, 1);
  }
}

onMounted(() => {
  document.addEventListener('dragover', syncMousePosition);
  getDeviceOptions();
});

onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition);
});
</script>

<template>
  <n-card class="h-full w-full" content-class="h-full w-full overflow-auto" content-style="padding:0;margin:0">
    <div ref="wrapper" :key="layoutKey" class="h-full w-full">
      <GridLayout
        ref="gridLayout"
        v-model:layout="layout"
        :auto-size="false"
        class="h-full w-full"
        :col-num="KANBANCOLNUM"
        :row-height="KANBANROWHEIGHT"
        :responsive="true"
        :margin="[10, 10]"
      >
        <div v-if="!layout.length" class="h-full flex items-center justify-center">
          <NEmpty description="暂未添加组件,移入添加按钮，然后拖入卡片吧"></NEmpty>
        </div>
        <template v-else>
          <GridItem
            v-for="item in layout"
            :key="item.i"
            :static="isPreview"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :min-h="2"
            :min-w="2"
          >
            <div class="relative h-full w-full">
              {{ item.i }}
              <NIcon
                v-if="!isPreview"
                class="absolute right-8 top-1.5 z-50 cursor-pointer cursor-pointer opacity-50 duration-200 hover:opacity-100"
              >
                <SvgIcon icon="uil:setting" class="text-base" />
              </NIcon>
              <NPopconfirm
                v-if="!isPreview"
                :show-icon="false"
                :negative-button-props="{ size: 'tiny' }"
                :positive-button-props="{ size: 'tiny' }"
                :on-positive-click="() => removeItem(item.i as string)"
              >
                <template #trigger>
                  <NIcon
                    class="absolute right-2 top-1.5 z-50 cursor-pointer cursor-pointer opacity-50 duration-200 hover:opacity-100"
                  >
                    <SvgIcon icon="material-symbols:delete-outline" class="text-base" />
                  </NIcon>
                </template>
                <span>{{ $t('generate.confirm-delete-dashboard') }}</span>
              </NPopconfirm>
              <TpCardItem :data="item.data!" :view="isPreview" />
            </div>
          </GridItem>
        </template>
      </GridLayout>
    </div>
  </n-card>
  <n-drawer
    v-model:show="active"
    :width="236"
    placement="left"
    :show-mask="false"
    style="box-shadow: 0 8px 16px 0 rgba(156, 107, 255, 0.4)"
  >
    <n-drawer-content title="卡片列表" class="shadow-sm" closable>
      <n-popselect v-model:value="value" :options="options" trigger="hover">
        <n-button class="w-full">{{ options.filter(i => i.value === value)[0].label }}</n-button>
      </n-popselect>
      <NSelect
        v-if="value === 'device'"
        v-model:value="deviceSelectId"
        class="m-t-12px"
        :placeholder="$t('generate.select-device')"
        :options="deviceOptions"
        value-field="device_id"
        label-field="device_name"
        @update:value="selectDevice"
      ></NSelect>
      <n-grid :x-gap="10" :y-gap="10" cols="1" class="m-t-12px">
        <n-gi
          v-for="item in KanBanCards[value]"
          :key="item.id"
          class="min-w-88px"
          draggable="true"
          unselectable="on"
          @drag="drag"
          @dragend="dragEnd(item)"
        >
          <div class="cursor-pointer overflow-hidden border rounded p-2px duration-200 hover:border-primary">
            <div class="text-center text-12px">
              {{ item.basicSettings.defaultTitle }}
            </div>
            <div class="h-100px w-full">
              <img :src="item.poster" alt="" style="width: 100%; height: 100%; object-fit: contain" />
            </div>
          </div>
        </n-gi>
      </n-grid>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}
</style>
