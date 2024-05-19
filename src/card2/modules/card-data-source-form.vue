<script setup lang="ts">
import { reactive, watch } from 'vue';
import { debounce } from 'lodash';
import { $t } from '@/locales';

defineOptions({ name: 'CardDataSourceForm' });

const props = defineProps<{
  changeCtxConfig: (key: string, data: any) => void;
  defaultSourceData?: Record<string, any>;
  maxSourceNumber: number;
}>();

const sourceData = reactive<{
  dataSource?: string;
  sourceNum?: number;
  deviceCount?: number;
  systemCount?: number;
  systemSource?: any[];
  deviceSource?: any[];
}>({ ...props.defaultSourceData });

const throttledWatcher = debounce(() => {
  props.changeCtxConfig('source', sourceData);
}, 300);

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
    <div v-if="sourceData.dataSource && sourceData.dataSource === 'system'">
      systemDataList
      <NFormItem>
        <n-input-number
          v-model:value="sourceData.systemCount"
          :min="1"
          :max="maxSourceNumber"
          class="m-b-2 w-360px"
          @update:value="
            () => {
              console.log(1);
            }
          "
        >
          <template #prefix>
            <span class="text-#999">系统数据个数</span>
          </template>
        </n-input-number>
      </NFormItem>
    </div>
    <div v-if="sourceData.dataSource && sourceData.dataSource === 'device'">
      deviceDataList
      <NFormItem>
        <n-input-number
          v-model:value="sourceData.deviceCount"
          :min="1"
          :max="maxSourceNumber"
          class="m-b-2 w-360px"
          @update:value="
            () => {
              console.log(1);
            }
          "
        >
          <template #prefix>
            <span class="text-#999">{{ $t('generate.device-count') }}</span>
          </template>
        </n-input-number>
      </NFormItem>
    </div>
  </NForm>
</template>

<style scoped></style>
