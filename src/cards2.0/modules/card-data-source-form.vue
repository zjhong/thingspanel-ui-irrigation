<script setup lang="tsx">
import { reactive, watch } from 'vue';
import { debounce } from 'lodash';
import { $t } from '@/locales';
import DeviceSelector from '@/cards2.0/modules/device-selector.vue';

defineOptions({ name: 'CardDataSourceForm' });

const props = defineProps<{
  changeCtxConfig: (key: string, data: any) => void;
  defaultSourceData?: Record<string, any>;
  maxSourceNumber: number;
}>();

const sourceData = reactive<{
  dataSource?: string;
  sourceNum?: number;
  systemCount?: number;
  systemSource?: any[];
  deviceSource?: any[];
}>({ ...props.defaultSourceData });

const throttledWatcher = debounce(() => {
  props.changeCtxConfig('source', sourceData);
}, 300);

const selection = v => {
  sourceData.deviceSource = v;
};
watch(
  () => sourceData,
  () => {
    throttledWatcher();
  },
  { deep: true }
);
</script>

<template>
  <NForm :model="sourceData">
    <NFormItem :label="$t('generate.data-source-type')">
      <NRadioGroup v-model:value="sourceData.dataSource" name="radio-group">
        <NSpace>
          <NRadioButton value="system">{{ $t('generate.system') }}</NRadioButton>
          <NRadioButton value="device">{{ $t('generate.device') }}</NRadioButton>
        </NSpace>
      </NRadioGroup>
    </NFormItem>
    <div v-if="sourceData.dataSource && sourceData.dataSource === 'system'">systemDataList</div>
    <div v-if="sourceData.dataSource && sourceData.dataSource === 'device'">
      <DeviceSelector
        :max-source-number="maxSourceNumber"
        :device-source="sourceData.deviceSource"
        @update:selection="selection"
      />
    </div>
  </NForm>
</template>

<style scoped></style>
