<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { TimeOutline } from '@vicons/ionicons5';
import { Circle24Regular, Target20Regular } from '@vicons/fluent';

const emit = defineEmits<{
  (event: 'update:value', value): void;
}>();
const props = defineProps<{
  device_id: string;
  thekey: string;
}>();

interface BaseAggregationData {
  device_id: string;
  key: string;
  aggregate_window: string;
  time_range: string;
  aggregate_function?: string;
}

// 当 time_range 为 "custom" 时的特定类型，使 start_time 和 end_time 成为必需
interface CustomTimeRangeAggregationData extends BaseAggregationData {
  time_range: 'custom';
  start_time: number;
  end_time: number;
}

// AggregationData 是两种类型的联合，根据 time_range 的值决定
type AggregationData = CustomTimeRangeAggregationData | BaseAggregationData;

const aggregation_data = ref<AggregationData>({
  device_id: props.device_id,
  key: props.thekey,
  aggregate_window: 'no_aggregate',
  time_range: 'last_1h'
});

const timeOptions = [
  { label: '自定义', value: 'custom' },
  { label: '最近5分钟', value: 'last_5m' },
  { label: '最近15分钟', value: 'last_15m' },
  { label: '最近30分钟', value: 'last_30m' },
  { label: '最近1小时', value: 'last_1h' },
  { label: '最近3小时', value: 'last_3h' },
  { label: '最近6小时', value: 'last_6h' },
  { label: '最近12小时', value: 'last_12h' },
  { label: '最近24小时', value: 'last_24h' },
  { label: '最近3天', value: 'last_3d' },
  { label: '最近7天', value: 'last_7d' },
  { label: '最近15天', value: 'last_15d' },
  { label: '最近30天', value: 'last_30d' },
  { label: '最近60天', value: 'last_60d' }
];

function onChangeTime(v) {
  console.log(v, '43243243');
  if (v) emit('update:value', aggregation_data.value);
}

function onChange(v) {
  console.log(v, '43243243');
  if (v !== 'cu') {
    console.log(v);
  }

  emit('update:value', aggregation_data.value);
}

onMounted(() => {
  onChange('');
});
</script>

<template>
  <div>
    <n-popselect
      v-model:value="aggregation_data.time_range"
      :options="timeOptions"
      trigger="click"
      @update:value="onChangeTime"
    >
      <n-icon size="24" :color="aggregation_data.time_range ? '#0e7a0d' : ''">
        <TimeOutline />
      </n-icon>
    </n-popselect>

    <n-popselect
      v-model:value="aggregation_data.aggregate_window"
      :options="timeOptions"
      trigger="click"
      @update:value="onChange"
    >
      <n-icon size="24" :color="aggregation_data.aggregate_window ? '#0e7a0d' : ''">
        <Target20Regular />
      </n-icon>
    </n-popselect>

    <!-- Corrected the property name here -->
    <n-popselect
      v-model:value="aggregation_data.aggregate_function"
      :options="timeOptions"
      trigger="click"
      @update:value="onChange"
    >
      <n-icon size="24" :color="aggregation_data.aggregate_function ? '#0e7a0d' : ''">
        <Circle24Regular />
      </n-icon>
    </n-popselect>
  </div>
</template>

<style scoped></style>
