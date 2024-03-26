<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { InformationCircleSharp } from '@vicons/ionicons5';
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

const copy = (data: object) => JSON.parse(JSON.stringify(data));
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
const message = useMessage();
const widths = ref(['flex-[44]', 'flex-[54]', 'flex-[2]']);
const count = ref<number>(2);
const changeWidths = () => {
  if (count.value === 1) {
    widths.value = ['flex-[2]', 'flex-[44]', 'flex-[54]'];
    count.value = 2;
  } else {
    widths.value = ['flex-[44]', 'flex-[54]', 'flex-[2]'];
    count.value = 1;
  }
};

const save = () => {
  if (!state?.curCardData?.cardId) {
    message.destroyAll();
    message.warning('请先选一个卡片');
    return;
  }
  count.value = 2;
  changeWidths();
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
    :style="{ width: 'calc(100vw - 180px)', height: 'calc(100vh - 50px)', minWidth: '882px' }"
    @close="
      () => {
        count = 2;
        changeWidths();
        emit('update:open', false);
      }
    "
    @mask-click="
      () => {
        count = 2;
        changeWidths();
        emit('update:open', false);
      }
    "
  >
    <div class="h-[calc(100vh_-_170px)] w-full flex">
      <div
        :class="'relative h-full flex flex-col p-4 overflow-hidden  ' + widths[0]"
        :style="
          count === 2
            ? 'background-color: #f0f0f0;opacity:0.4;box-shadow: 10px 0 15px rgba(0, 0, 0, 0.3);transition: all 0.3s ease;'
            : ''
        "
        @mouseenter="
          () => {
            count = 2;
            changeWidths();
          }
        "
      >
        <NTabs
          type="line"
          default-value="builtin"
          :value="tabValue"
          animated
          class="h-full"
          @update:value="value => (tabValue = value)"
        >
          <NTabPane v-for="item1 in tabList" :key="item1.type" class="h-full" :name="item1.type" :tab="item1.tab">
            <n-scrollbar style="height: 100%; padding: 4px">
              <n-grid :x-gap="10" :y-gap="10" cols="1 240:1 480:2 720:3">
                <n-gi v-for="item in PanelCards[item1.type]" :key="item.id" class="min-w-240px">
                  <div
                    class="cursor-pointer overflow-hidden border rounded p-2px duration-200"
                    :style="item.id === state?.curCardData?.cardId ? 'border-color: #2d3d88' : 'border-color: #f6f9f8'"
                    @mousedown.prevent=""
                    @click="selectCard(item)"
                  >
                    <div class="text-center font-medium leading-8 dark:bg-zinc-900">{{ $t(item.title) }}</div>
                    <div class="h-148px w-full">
                      <img :src="item.poster" alt="" style="width: 100%; height: 100%; object-fit: contain" />
                    </div>
                  </div>
                </n-gi>
              </n-grid>
            </n-scrollbar>
          </NTabPane>
        </NTabs>
        <n-float-button v-if="count === 2" position="absolute" :left="4" top="42%" width="20" shape="square">
          <spna class="text-12px text-primary-600">移入展开卡片</spna>
        </n-float-button>
      </div>
      <div :class="'h-full flex-center justify-center border-r bg-[#f6f9f8] p-2 overflow-hidden ' + widths[1]">
        <div v-if="!state.curCardData?.cardId" class="mt-32">
          <NEmpty description="请选择要添加的卡片"></NEmpty>
        </div>
        <div
          v-if="state.curCardData?.cardId"
          class="mr-4 mt-2 h-full w-full flex flex-col justify-center bg-[#f6f9f8] dark:bg-[#101014]"
        >
          <div id="panel_view" class="w-full overflow-y-auto p-4">
            <CardTemplateItem :data="state.curCardData as any" />
          </div>
        </div>
      </div>

      <div
        :class="'relative h-full overflow-hidden p-4 ' + widths[2]"
        :style="
          count === 1
            ? 'background-color: #f0f0f0;opacity:0.4;box-shadow: -10px 0 15px rgba(0, 0, 0, 0.3);transition: all 0.3s ease;'
            : ''
        "
        @mouseenter="
          () => {
            if (!state?.curCardData?.cardId) {
              message.destroyAll();
              return message.warning('请先选一个卡片');
            }
            count = 1;
            changeWidths();
          }
        "
      >
        <div class="mt-4 h-full flex-col justify-start">
          <CardTemplateForm ref="formRef" @update="(data: any) => (state.curCardData = data)" />
        </div>
        <n-float-button v-if="count === 1" position="absolute" :right="0" top="42%" width="20" shape="square">
          <spna class="text-12px text-primary-600">移入展开配置</spna>
        </n-float-button>
      </div>
    </div>
    <div class="h-60px flex flex-center border-t">
      <div>
        <NButton
          class="mr-4"
          @click="
            () => {
              count = 2;
              changeWidths();
              emit('update:open', false);
            }
          "
        >
          取消
        </NButton>
        <NButton class="mr-4" type="primary" @click="save">确认</NButton>
      </div>
    </div>
    <div v-if="count === 1" class="absolute bottom-0 right-0 h-60px flex flex-center">
      <n-icon size="24">
        <InformationCircleSharp class="color-red" />
      </n-icon>
      <span>您可以移入右侧配置区进入配置，也可以确认后稍后配置改对m没</span>
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
