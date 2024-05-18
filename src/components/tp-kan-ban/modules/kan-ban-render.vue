<script setup lang="ts">
import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
// eslint-disable-next-line vue/prefer-import-from-vue
import type { UnwrapRefSimple } from '@vue/reactivity';
import { throttle } from 'lodash-es';
import { GridItem, GridLayout } from 'grid-layout-plus';
import type { CardView } from '@/components/tp-kan-ban/kan-ban';
import { $t } from '@/locales';
import { KanBanCards } from '@/card2';
import type { CardType } from '@/card2/card';
import { deviceTemplateSelect } from '@/service/api';
import { KANBANCOLNUM, KANBANROWHEIGHT } from '@/constants/common';
import TpCardItem from '@/components/tp-kan-ban/modules/tp-card-item.vue';
defineOptions({ name: 'KanBanRender' });
const props = defineProps<{ isPreview: boolean; layout: CardView[] }>();

watch(
  props.layout,
  () => {
    console.log(props.layout);
  },
  { deep: true }
);
// 抽屉相关的开始
const value = ref<CardType | 'device'>('plugins');
const options = [
  { label: '系统', value: 'system' },
  { label: '插件', value: 'plugins' },
  { label: '设备', value: 'device' },
  { label: '图表', value: 'chart' }
];
const active = defineModel<boolean>('active', { required: true, default: false });
const selectDevice = (v, o) => {
  console.log(v, o);
  const cardIdArr = ['card_chart_demo1'];
  KanBanCards.device = KanBanCards.chart.filter(i => i.id === cardIdArr[0]);
};
const deviceSelectId = ref<string>('');
const deviceOptions = ref<UnwrapRefSimple<any>[]>();

const getDeviceOptions = async () => {
  const { data, error } = await deviceTemplateSelect();
  if (!error) {
    deviceOptions.value = data;
  }
};
const cardConfig = ref<Record<string, any>>({});

// 抽屉相关的结束
const showModal = ref<boolean>(false);
const theLayout = ref<CardView[]>([]);

const wrapper = ref<HTMLElement>();
const gridLayout = ref<InstanceType<typeof GridLayout>>();

onMounted(() => {
  theLayout.value = props.layout;
  getDeviceOptions();
  document.addEventListener('dragover', syncMousePosition);
});

onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition);
});

const mouseAt = { x: -1, y: -1 };

function syncMousePosition(event: MouseEvent) {
  mouseAt.x = event.clientX;
  mouseAt.y = event.clientY;
}

const dropId = 'drop';
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

const drag = throttle(() => {
  const parentRect = wrapper.value?.getBoundingClientRect();

  if (!parentRect || !gridLayout.value) return;

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom;

  if (mouseInGrid && !theLayout.value.find(item => item.i === dropId)) {
    theLayout.value.push({
      x: (theLayout.value.length * 2) % 12,
      y: theLayout.value.length + 12, // puts it at the bottom
      w: 2,
      h: 2,
      i: dropId
    });
  }

  const index = theLayout.value.findIndex(item => item.i === dropId);

  if (index !== -1) {
    const item = gridLayout.value.getItem(dropId);

    if (!item) return;

    try {
      item.wrapper.style.display = 'none';
    } catch (e) {}

    Object.assign(item.state, {
      top: mouseAt.y - parentRect.top,
      left: mouseAt.x - parentRect.left
    });
    const newPos = item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left);
    console.log(newPos);
    if (mouseInGrid) {
      gridLayout.value.dragEvent('dragstart', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w);
      dragItem.i = String(index);
      dragItem.x = theLayout.value[index].x;
      dragItem.y = theLayout.value[index].y;
    } else {
      gridLayout.value.dragEvent('dragend', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      theLayout.value = theLayout.value.filter(item => item.i !== dropId);
    }
    console.log(97);
  }
}, 50);

function dragEnd(cardItem) {
  drag.cancel();
  const parentRect = wrapper.value?.getBoundingClientRect();

  if (!parentRect || !gridLayout.value) return;

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom;

  if (mouseInGrid) {
    gridLayout.value.dragEvent('dragend', dropId, dragItem.x, dragItem.y, dragItem.h, dragItem.w);
    theLayout.value = theLayout.value.filter(item => item.i !== dropId);
  } else {
    return;
  }

  const minWh = {
    minW: 2,
    minH: 2
  };
  console.log(minWh);
  if (cardItem.cardItemBase.minWH.minW !== -1) {
    if (typeof cardItem.cardItemBase.minWH.minW === 'number') {
      minWh.minW = cardItem.cardItemBase.minWH.minW;
    } else {
      const w = cardItem.cardItemBase.minWH.minW.replace('px', '');
      console.log(gridLayout.value.state.width);
      minWh.minW = Math.ceil(Number(w) / (gridLayout.value.state.width / KANBANCOLNUM));
    }
  }
  if (cardItem.cardItemBase.minWH.minH !== -1) {
    if (typeof cardItem.cardItemBase.minWH.minH === 'number') {
      minWh.minH = cardItem.cardItemBase.minWH.minH;
    } else {
      const h = cardItem.cardItemBase.minWH.minH.replace('px', '');

      minWh.minH = Math.ceil(Number(h) / KANBANROWHEIGHT);
    }
  }
  console.log(minWh);
  theLayout.value.push({
    x: dragItem.x < 0 ? 0 : dragItem.x,
    y: dragItem.y < 0 ? 0 : dragItem.y,
    w: minWh.minW,
    h: minWh.minH,
    minH: minWh.minH,
    minW: minWh.minW,
    i: `${theLayout.value.length.toString()}_${cardItem.cardItemBase.id}`,
    data: {
      cardItem: cardItem.cardItemBase,
      cardId: cardItem.cardItemBase.id,
      config: {
        title: cardItem.cardItemBase.basicSettings.defaultTitle,
        showTitle: cardItem.cardItemBase.basicSettings.showTitle
      },
      deviceList: [],
      xdata: []
    }
  });
  console.log(theLayout.value);
  gridLayout.value.dragEvent('dragend', dragItem.i, dragItem.x, dragItem.y, dragItem.h, dragItem.w);

  const item = gridLayout.value.getItem(dropId);

  if (item) {
    try {
      item.wrapper.style.display = '';
    } catch (e) {}
  }
}

function removeItem(id: string) {
  const index = theLayout.value.findIndex(item => item.i === id);
  if (index > -1) {
    theLayout.value.splice(index, 1);
  }
}
function toggleModal(f) {
  showModal.value = f;
}
// eslint-disable-next-line @typescript-eslint/no-shadow
function updataCardConfig(value: Record<string, any>) {
  cardConfig.value = { ...value };
}
provide<Ref<boolean>>('showModal', showModal);
provide<(f: boolean) => void>('toggleModal', toggleModal);
provide<(value: Record<string, any>) => void>('updataCardConfig', updataCardConfig);

const print = () => {
  console.log(cardConfig.value);
};
</script>

<template>
  <n-card class="h-full w-full" content-class="h-full w-full overflow-auto" content-style="padding:0;margin:0">
    <div @click="print">cardConfig</div>
    <div ref="wrapper" key="layoutKey" class="h-full w-full">
      <GridLayout
        ref="gridLayout"
        v-model:layout="theLayout"
        style="height: 100%"
        class="w-full"
        :col-num="KANBANCOLNUM"
        :row-height="KANBANROWHEIGHT"
        :responsive="true"
        :margin="[10, 10]"
      >
        <div v-if="!theLayout.length" class="h-full flex items-center justify-center">
          <NEmpty description="暂未添加组件,移入添加按钮，然后拖入卡片吧"></NEmpty>
        </div>
        <template v-else>
          <GridItem
            v-for="item in theLayout"
            :key="item.i"
            :static="isPreview"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :min-w="item.minW"
            :min-h="item.minH"
          >
            <div class="relative h-full w-full">
              <NIcon
                v-if="!isPreview"
                class="absolute right-8 top-1.5 z-50 cursor-pointer cursor-pointer opacity-50 duration-200 hover:opacity-100"
                @click="toggleModal(true)"
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
              <TpCardItem :data="item.data!" :view="isPreview" @toggle-modal="toggleModal" />
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
          :key="item.cardItemBase.renderID || item.cardItemBase.id"
          class="min-w-88px"
          draggable="true"
          unselectable="on"
          @drag="drag"
          @dragend="dragEnd(item)"
        >
          <div class="cursor-pointer overflow-hidden border rounded p-2px duration-200 hover:border-primary">
            <div class="text-center text-12px">
              {{ item.cardItemBase.basicSettings.defaultTitle }}
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

<style scoped></style>
