<script setup lang="tsx">
import { onMounted, onUpdated, reactive, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { $t } from '@/locales';
import { deviceListForPanel, deviceMetricsList } from '@/service/api';
defineOptions({ name: 'CardDataSourceForm' });
const sourceData = reactive<{
  dataSource: string;
  sourceNum: number;
  deviceCount: number;
  systemSource: any[];
  deviceSource: any[];
}>({
  dataSource: 'system',
  sourceNum: 3,
  deviceCount: 1,
  systemSource: [{}],
  deviceSource: [{}]
});
const systemNorm = [
  { label: '设备总数', value: 1 },
  { label: '在线设备数量', value: 2 },
  { label: '离线设备数量', value: 3 }
];
const removeSource = (i: number) => {
  if (sourceData.dataSource === 'system') {
    sourceData.systemSource.splice(i, 1);
  } else {
    sourceData.deviceSource.splice(i, 1);
  }
};
const deviceOption = ref<SelectOption[]>();
const getDeviceList = async () => {
  const res = await deviceListForPanel({});
  deviceOption.value = res.data;
};
const deviceCountUpdate = v => {
  sourceData.deviceCount = v;
  if (sourceData.deviceSource.length < v) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= v - sourceData.deviceSource.length + 1; i++) {
      sourceData.deviceSource.push({});
    }
  }
};
const deviceSelectChange = async (v, item) => {
  console.log(v);
  const res = await deviceMetricsList(v);
  console.log(res.data);
  item.metricsOptions = res?.data || [];
};
const updateDropdownShow = (show: boolean, item) => {
  item.metricsShow = show;
};
const metricsOptionRender = (info, item) => {
  return (
    <n-card
      class="border-b border-#d9d9d9"
      title={<span style="font-size: 16px;color:#999">{info?.option?.data_source_type}</span>}
      bordered={false}
    >
      {info?.option?.options?.map(it => {
        return (
          <div
            onClick={() => {
              console.log(it);
              item.metricsId = it.key;
              item.metricsName = it.label || '';

              updateDropdownShow(false, item);
            }}
          >
            <span class={it.key === item.metricsId ? 'mr-6 color-primary-700' : 'mr-2 color-#333'}>
              {it.key}({it.label || '--'})
            </span>
            <span class="text-#999">{it.data_type} </span>
          </div>
        );
      })}
    </n-card>
  );
};

onUpdated(() => {
  getDeviceList();
});
onMounted(() => {
  getDeviceList();
});
</script>

<template>
  <div class="overflow-y-auto py-5">
    <NForm>
      <NFormItem :label="$t('generate.data-source-type')">
        <NRadioGroup v-model:value="sourceData.dataSource" name="radiogroup">
          <NSpace>
            <NRadioButton value="system">{{ $t('generate.system') }}</NRadioButton>
            <NRadioButton value="device">{{ $t('generate.device') }}</NRadioButton>
          </NSpace>
        </NRadioGroup>
      </NFormItem>
      <div v-if="sourceData.dataSource === 'system'">
        <div v-for="(item, i) in sourceData.systemSource" :key="i" class="mb-4 flex space-x-2">
          <NSelect v-model:value="item.type" class="w-36" :options="systemNorm" />
          <NInput v-model:value="item.name" :placeholder="$t('generate.data-source-name')" style="width: 200px" />
          <NButton
            v-if="typeof sourceData.sourceNum !== 'number'"
            ghost
            tertiary
            type="warning"
            @click="removeSource(i)"
          >
            <template #icon>
              <SvgIcon icon="material-symbols:delete-outline" />
            </template>
          </NButton>
        </div>
        <NButton v-if="typeof sourceData.sourceNum !== 'number'" block @click="sourceData.systemSource?.push({})">
          {{ $t('generate.add') }}
        </NButton>
      </div>
      <div v-if="sourceData.dataSource === 'device'">
        <n-input-number
          v-model:value="sourceData.deviceCount"
          :min="1"
          :max="sourceData.sourceNum"
          class="m-b-2 w-360px"
          @update:value="deviceCountUpdate"
        >
          <template #prefix>
            <span class="text-#999">{{ $t('generate.device-count') }}</span>
          </template>
        </n-input-number>

        <div v-for="(item, i) in sourceData.deviceSource" :key="i" class="mb-4 flex space-x-2">
          <NSelect
            v-if="i <= sourceData.deviceCount - 1"
            v-model:value="item.deviceId"
            class="w-120px"
            :options="deviceOption"
            label-field="name"
            value-field="id"
            @update:value="value => deviceSelectChange(value, item)"
          >
            <template #header>{{ $t('generate.device') }}</template>
          </NSelect>

          <NSelect
            v-if="i <= sourceData.deviceCount - 1"
            v-model:value="item.metricsId"
            class="w-225px"
            :show="item.metricsShow"
            :options="item?.metricsOptions"
            :render-option="info => metricsOptionRender(info, item)"
            @update:show="show => updateDropdownShow(show, item)"
          ></NSelect>
          <NInput v-if="i <= sourceData.deviceCount - 1" v-model:value="item.metricsName" style="max-width: 140px" />
        </div>
      </div>
    </NForm>
  </div>
</template>

<style scoped></style>
