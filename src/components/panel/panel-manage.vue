<script lang="tsx" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
// eslint-disable-next-line vue/prefer-import-from-vue
import type { UnwrapRefSimple } from '@vue/reactivity';
import type { ICardData, ICardFormIns, ICardRender, ICardView } from '@/components/panel/card';
import { PutBoard, deviceTemplateSelect, getBoard } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

const props = defineProps<{ panelId: string }>();
const panelDate = ref<Panel.Board>();
const cr = ref<ICardRender>();
const fullui = ref();

const showingCardList = ref(false);
const isEditing = ref(false);
const editingCard = ref(false);
const deviceOptions = ref<UnwrapRefSimple<any>[]>();
const webChartConfig = ref<any>([]);

const getDeviceOptions = async () => {
  const { data, error } = await deviceTemplateSelect();
  if (!error) {
    deviceOptions.value = data;
  }
};

const { isFullscreen, toggle } = useFullscreen(fullui);
const appStore = useAppStore();
const layout = ref<ICardView[]>([]);
const fetchBroad = async () => {
  const { data } = await getBoard(props.panelId);
  if (data) {
    panelDate.value = data;
    if (data.config) {
      const configJson = JSON.parse(data.config);
      updateConfigData(configJson);
      layout.value = [...configJson, ...layout.value];
    }
  }
};

/**
 * Todo: Once all config data in server are updated to use unique number as "i" attribute, we can remove this function.
 * Convert a string to a unique number.
 *
 * @param str
 * @returns
 */
function stringToUniqueNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = hash * 31 + str.charCodeAt(i);
  }
  return hash;
}

/**
 * Todo: Once all config data in server are updated to use unique number as "i" attribute, we can remove this function.
 * The attribute "i" of each config data may be a string instead of a number, so we need to convert it to a unique
 * number to avoid Vue's warning.
 *
 * @param configJson
 */
function updateConfigData(configJson: ICardView[]) {
  for (const item of configJson) {
    if (typeof item.i === 'string') {
      item.i = stringToUniqueNumber(item.i);
    }
  }
}

const state = reactive({
  cardData: null as null | ICardData
});

const editView = ref<ICardView | null>();
const formRef = ref<ICardFormIns>();

const toEditMode = () => {
  isEditing.value = true;
};
const quitEditMode = () => {
  isEditing.value = false;
};

const insertCard = (card: ICardData) => {
  cr.value?.addCard(card);
  editView.value = null;
  state.cardData = null;
  toEditMode();
};

const updateCard = (card: ICardData) => {
  if (editView.value) {
    editView.value.data = card;
  }
};

const edit = (view: ICardView) => {
  editingCard.value = true;

  editView.value = view;
  state.cardData = view.data || null;

  if (state.cardData?.dataSource?.deviceSource && state.cardData?.dataSource?.deviceSource?.length > 0) {
    const deviceSelectId = state.cardData?.dataSource?.deviceSource[0]?.deviceId || '';
    const deviceOption = deviceOptions.value?.find(item => item.device_id === deviceSelectId);
    if (deviceOption && deviceOption.web_chart_config) {
      webChartConfig.value = JSON.parse(deviceOption?.web_chart_config);
    } else {
      webChartConfig.value = [];
    }
  }
  nextTick(() => {
    formRef.value?.setCard(state.cardData as any);
  });
};
const showCardList = () => {
  showingCardList.value = true;
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

onMounted(() => {
  fetchBroad();
  getDeviceOptions();
});
</script>

<template>
  <div class="w-full px-5 py-5">
    <div
      v-show="!appStore.fullContent"
      class="flex items-center justify-between border-b border-gray-200 px-10px pb-3 dark:border-gray-200/10"
    >
      <div>
        <!--
        <<NButton @click="router.go(-1)">
          <SvgIcon icon="ep:back" class="mr-0.5 text-lg" />
          {{ $t('page.login.common.back') }}
        </NButton>
-->
        <NSpace align="center">
          <span class="text-14px font-medium line-height-normal">看板：{{ panelDate?.name }}</span>
          <NButton @mouseover="showCardList">
            <SvgIcon icon="material-symbols:add" class="mr-0.5 text-lg" />
            {{ $t('generate.add-component') }}
          </NButton>
        </NSpace>
      </div>
      <NSpace align="center">
        <!--        <NButton>-->
        <!--          <SvgIcon icon="material-symbols:settings-outline" class="mr-0.5 text-lg" />-->
        <!--        </NButton>-->
        <NDivider vertical />
        <NButton v-if="!isEditing" @click="toEditMode">
          <SvgIcon icon="material-symbols:edit" class="mr-0.5 text-lg" />
          {{ $t('generate.edit') }}
        </NButton>
        <NButton v-if="isEditing" @click="quitEditMode">退出编辑</NButton>
        <NButton @click="savePanel">{{ $t('common.save') }}</NButton>
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
    <div ref="fullui" class="h-edit-area flex bg-white">
      <n-drawer
        v-model:show="showingCardList"
        :width="300"
        placement="left"
        :show-mask="false"
        style="box-shadow: 0 8px 16px 0 rgba(156, 107, 255, 0.4)"
      >
        <n-drawer-content title="卡片列表" class="shadow-sm" closable>
          <CardSelector v-if="showingCardList" class="h-full w-full overflow-auto" @select-card="insertCard" />
        </n-drawer-content>
      </n-drawer>

      <div class="h-full flex-1 overflow-auto">
        <div v-if="!layout.length" class="text-center text-gray-500 dark:text-gray-400">
          <NEmpty :description="$t('common.componentsAddedYet')"></NEmpty>
        </div>
        <CardRender
          ref="cr"
          v-model:layout="layout"
          :is-preview="!isEditing"
          :col-num="12"
          :default-card-col="4"
          :row-height="85"
          @edit="edit"
        />
      </div>

      <n-drawer
        v-model:show="editingCard"
        :width="500"
        placement="right"
        :show-mask="false"
        style="box-shadow: 0 8px 16px 0 rgba(156, 107, 255, 0.4)"
      >
        <n-drawer-content title="卡片配置" class="shadow-sm" closable>
          <CardForm
            ref="formRef"
            class="h-full w-full overflow-auto"
            :device-web-chart-config="webChartConfig"
            @update="(data: any) => updateCard(data)"
          />
        </n-drawer-content>
      </n-drawer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  @apply border border-transparent;
}
.h-content {
  height: calc(100% - 48px);
}
.h-edit-area {
  height: calc(100% - 30px);
}
</style>
