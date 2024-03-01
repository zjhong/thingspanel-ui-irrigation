<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { usePanelStore } from '@/store/modules/panel';
import ConfigCtx from '@/components/panel/ui/config-ctx.vue';
import type { ICardData, ICardDefine } from '@/components/panel/card';
const copy = (obj: object) => JSON.parse(JSON.stringify(obj));

defineProps<{
  mobile?: boolean;
}>();
const systemNorm = [
  { label: '设备总数', value: 1 },
  { label: '在线设备数量', value: 2 },
  { label: '离线设备数量', value: 3 }
];
const store = usePanelStore();
const defData = {
  cardId: '',
  type: 'builtin',
  title: '',
  config: {} as any,
  basicSettings: {} as any,
  dataSource: {
    origin: 'system',
    systemSource: [{}],
    deviceSource: [{}]
  } as any
};
const state = reactive({
  tab: 'system',
  selectCard: null as null | ICardDefine,
  data: copy(defData)
});

const emit = defineEmits<{
  (e: 'update', data: ICardData): void;
}>();

watch(
  () => state.data,
  data => {
    emit('update', data as any);
  },
  { deep: true }
);

const removeSource = (i: number) => {
  if (state.data.dataSource.origin === 'system') {
    state.data.dataSource.systemSource.splice(i, 1);
  } else {
    state.data.dataSource.deviceSource.splice(i, 1);
  }
};

defineExpose({
  setCard: (data?: ICardData) => {
    state.selectCard = null;
    state.data = copy(data || defData);
    setTimeout(() => {
      state.selectCard = store.$state.cardMap.get(state.data.cardId) || null;
      if (state.data.type === 'chart') state.tab = 'dataSource';
      else if (state.selectCard?.configForm) state.tab = 'config';
      else state.tab = 'basic';
    });
  }
});
</script>

<template>
  <div>
    <NTabs v-if="state.selectCard" v-model:value="state.tab" type="line" animated>
      <NTabPane v-if="state.selectCard.type === 'chart'" name="dataSource" tab="数据源">
        <div :class="`${mobile ? '' : 'max-h-[calc(100vh_-_500px)] overflow-y-auto'} py-5`">
          <NForm>
            <NFormItem label="数据源类型">
              <NRadioGroup v-model:value="state.data.dataSource.origin" name="radiogroup">
                <NSpace>
                  <NRadioButton value="system">系统</NRadioButton>
                  <NRadioButton value="device">设备</NRadioButton>
                </NSpace>
              </NRadioGroup>
            </NFormItem>
            <div v-if="state.data.dataSource?.origin === 'system'">
              <div v-for="(item, i) in state.data.dataSource.systemSource" :key="i" class="mb-4 flex space-x-2">
                <NSelect v-model:value="item.type" class="w-36" :options="systemNorm" />
                <NInput v-model:value="item.name" placeholder="数据源名称" style="width: 200px" />
                <NButton
                  v-if="typeof state.data.dataSource?.sourceNum !== 'number'"
                  tertiary
                  ghost
                  type="warning"
                  @click="removeSource(i)"
                >
                  <template #icon>
                    <SvgIcon icon="material-symbols:delete-outline" />
                  </template>
                </NButton>
              </div>
              <NButton
                v-if="typeof state.data.dataSource?.sourceNum !== 'number'"
                block
                @click="state.data.dataSource?.systemSource?.push({})"
              >
                添加
              </NButton>
            </div>
          </NForm>
        </div>
      </NTabPane>
      <NTabPane v-if="!!state.selectCard!.configForm" name="config" tab="组件设置">
        <div :class="`${mobile ? '' : 'max-h-[calc(100vh_-_500px)] overflow-y-auto'} py-5`">
          <div class="max-w-[600px]">
            <ConfigCtx v-model:config="state.data.config" mode="insert">
              <component :is="state.selectCard!.configForm" />
            </ConfigCtx>
          </div>
        </div>
      </NTabPane>
      <NTabPane name="basic" tab="基础设置">
        <NForm>
          <NFormItem label="标题">
            <div class="flex items-center">
              <div class="w-36">
                <NCheckbox v-model:checked="state.data.basicSettings.showTitle">显示标题</NCheckbox>
              </div>
              <NInput
                v-if="state.data.basicSettings.showTitle"
                v-model:value="state.data.basicSettings.title"
                @keydown.enter.prevent
              />
            </div>
          </NFormItem>
        </NForm>
      </NTabPane>
    </NTabs>
  </div>
</template>
