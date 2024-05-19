<script setup lang="ts">
import { computed, defineEmits, reactive, ref } from 'vue';
import { NButton, NForm, NFormItem, NFormItemGi, NGrid, NInputNumber, NSelect, NSpace } from 'naive-ui';

interface Device {
  selectedDevice: string;
  selectedIndicator: string;
}

const formRef = ref();
const deviceCount = ref(1);
const devices = reactive<Device[][]>([[]]);
const deviceOptions = ref([
  { label: '设备1', value: 'device1' },
  { label: '设备2', value: 'device2' },
  { label: '设备3', value: 'device3' },
  { label: '设备4', value: 'device4' },
  { label: '设备5', value: 'device5' }
]);

const indicatorOptions = ref({
  device1: [
    { label: '指标1-1', value: 'indicator1-1' },
    { label: '指标1-2', value: 'indicator1-2' }
  ],
  device2: [
    { label: '指标2-1', value: 'indicator2-1' },
    { label: '指标2-2', value: 'indicator2-2' }
  ],
  device3: [
    { label: '指标3-1', value: 'indicator3-1' },
    { label: '指标3-2', value: 'indicator3-2' }
  ],
  device4: [
    { label: '指标4-1', value: 'indicator4-1' },
    { label: '指标4-2', value: 'indicator4-2' }
  ],
  device5: [
    { label: '指标5-1', value: 'indicator5-1' },
    { label: '指标5-2', value: 'indicator5-2' }
  ]
});

const currentPage = ref(1);
const pageSize = 5;

const totalPages = computed(() => Math.ceil(deviceCount.value / pageSize));

const currentBatchDevices = computed(() => {
  return devices[currentPage.value - 1] || [];
});

const adjustDeviceCount = (count: number) => {
  const totalBatches = Math.ceil(count / pageSize);
  if (totalBatches > devices.length) {
    for (let i = devices.length; i < totalBatches; i++) {
      devices.push([]);
    }
  }
  for (let i = 0; i < totalBatches; i++) {
    const batchStart = i * pageSize;
    const batchEnd = Math.min(batchStart + pageSize, count);
    if (devices[i].length > batchEnd - batchStart) {
      devices[i].length = batchEnd - batchStart;
    } else {
      // eslint-disable-next-line no-plusplus
      for (let j = devices[i].length; j < batchEnd - batchStart; j++) {
        devices[i].push({ selectedDevice: '', selectedIndicator: '' });
      }
    }
  }
};

const handleDeviceCountChange = (value: number) => {
  adjustDeviceCount(value);
};

const handleDeviceChange = (index: number) => {
  return (_value: string) => {
    currentBatchDevices.value[index].selectedIndicator = '';
  };
};

const emits = defineEmits(['update:selection']);
const submitSelection = () => {
  const flatDevices = devices.flat().slice(0, deviceCount.value);
  emits('update:selection', flatDevices);
};

const isCurrentPageComplete = () => {
  const batchDevices = currentBatchDevices.value;
  return batchDevices.every(device => device.selectedDevice && device.selectedIndicator);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value && isCurrentPageComplete()) {
    currentPage.value += 1;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};
</script>

<template>
  <NForm ref="formRef">
    <NFormItem label="设备数量">
      <NInputNumber v-model:value="deviceCount" @update:value="handleDeviceCountChange" />
    </NFormItem>
    <NGrid cols="2" x-gap="12">
      <template v-for="(device, index) in currentBatchDevices" :key="index">
        <NFormItemGi :label="`设备 ${(currentPage - 1) * pageSize + index + 1}`">
          <NSelect
            v-model:value="device.selectedDevice"
            :options="deviceOptions"
            @update:value="handleDeviceChange(index)"
          />
        </NFormItemGi>
        <NFormItemGi :label="`指标 ${(currentPage - 1) * pageSize + index + 1}`">
          <NSelect
            v-model:value="device.selectedIndicator"
            :options="indicatorOptions[device.selectedDevice]"
            :disabled="!device.selectedDevice"
          />
        </NFormItemGi>
      </template>
    </NGrid>
    <NSpace v-if="totalPages > 1" justify="space-between">
      <NButton :disabled="currentPage === 1" @click="previousPage">上一页</NButton>
      <NButton :disabled="!isCurrentPageComplete() || currentPage === totalPages" @click="nextPage">下一页</NButton>
    </NSpace>
    <NButton @click="submitSelection">提交</NButton>
  </NForm>
</template>
