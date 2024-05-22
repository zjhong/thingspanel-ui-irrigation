<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-17 16:22:54
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-24 16:04:26
-->
<script setup lang="tsx">
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import type { DataTableColumns, DataTableRowKey, PaginationProps } from 'naive-ui';
import dayjs from 'dayjs';
import { batchProcessing, infoList, processingOperation } from '@/service/api/alarm';
import { $t } from '@/locales';

const loading = ref(false);
const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const rowKey = (row: DeviceManagement.DeviceData) => row.id;
const message = useMessage();
const options = ref([
  {
    label: '高',
    value: 'H'
  },
  {
    label: '中',
    value: 'M'
  },
  {
    label: '低',
    value: 'L'
  }
]);
const dispose = ref([
  {
    label: '未处理',
    value: 'UND'
  },
  {
    label: '已处理',
    value: 'DOP'
  }
]);

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
    list();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    list();
  }
});

interface ColumnsData {
  id: string;
  time: string;
  name: string;
  description: string;
  alarm_level: string;
  notification_group_id: string;
  enabled: string;
  result: string;
  handler: string;
}

const columns: Ref<DataTableColumns<ColumnsData>> = ref([
  {
    type: 'selection',
    disabled(row: any) {
      return row.name === 'Edward King 3';
    }
  },
  {
    key: 'alarm_time',
    title: '告警时间',
    align: 'center',
    minWidth: '140px',
    render(row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) {
      return dayjs(row.alarm_time).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    key: 'name',
    title: '告警名称',
    align: 'center',
    minWidth: '100px',
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'alarm_level',
    title: '级别',
    align: 'center',
    width: '90px',
    render(row) {
      if (row.alarm_level === 'H') {
        return '高';
      } else if (row.alarm_level === 'M') {
        return '中';
      }
      return '低';
    }
  },
  {
    key: 'description',
    title: '告警描述',
    align: 'center',
    minWidth: '180px',
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'processing_result',
    title: '处理结果',
    align: 'center',
    width: '90px',
    render(row) {
      if (row.alarm_level === 'DOP') {
        return '已处理';
      } else if (row.alarm_level === 'UND') {
        return '未处理';
      }
      return '已忽略';
    }
  },
  {
    key: 'processor_name',
    title: '处理人',
    width: '90px',
    align: 'center'
  },

  {
    key: 'actions',
    title: '操作',
    minWidth: '200px',
    align: 'center',
    render: row => {
      return (
        <div class="flex gap-20px">
          <NButton type="primary" size={'small'} onClick={() => handleEditPwd(row)}>
            详情
          </NButton>
          <NButton type="warning" size={'small'} onClick={() => handleEditTable(row.id, 'UND')}>
            处理
          </NButton>
          <NButton size={'small'} onClick={() => handOpenLogModal(row.id, 'IGN')}>
            忽略
          </NButton>
        </div>
      );
    }
  }
]) as Ref<DataTableColumns<ColumnsData>>;
const paramsData = ref({
  id: '',
  processing_result: ''
});

/** 处理 */
async function disposeData() {
  loading.value = true;
  const { data } = await processingOperation(paramsData.value);
  if (data) {
    loading.value = false;
    message.success('操作成功');
  } else {
    message.error('操作失败');
    loading.value = false;
  }
}

function handleEditTable(rowId: string, type: string) {
  console.log(1111);
  paramsData.value.id = rowId;
  paramsData.value.processing_result = type;
  disposeData();
}

function handOpenLogModal(rowId: string, type: string) {
  paramsData.value.id = rowId;
  paramsData.value.processing_result = type;
  disposeData();
  console.log(1111);
}

/** @description: 批量处理 */
const batchData = ref({
  id: ref<DataTableRowKey[]>([]),
  processing_result: '',
  processing_instructions: '测试'
});

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys;
  console.log('piliang', checkedRowKeysRef.value);
  batchData.value.id = checkedRowKeysRef.value;
}

async function batchProcessings() {
  const { data } = await batchProcessing(batchData.value);
  console.log(data);
  if (!data) {
    loading.value = false;
    message.success('批量操作成功');
  } else {
    message.error('批量操作失败');
    loading.value = false;
  }
}

function handleBatch() {
  batchData.value.processing_result = 'UND';
  batchProcessings();
}

/** @description: 批量忽略 */
function handleIgnore() {
  batchData.value.processing_result = 'IGN';
  batchProcessings();
}

const listData = ref({
  alarmLevel: '',
  processingResult: '',
  StartTime: '',
  EndTime: '',
  page: 1,
  page_size: 10
});

const range = ref<[number, number]>([1183135260000, Date.now()]);
const tableData = ref<ColumnsData[]>([]);

/** 告警信息列表 */
async function list() {
  loading.value = true;
  const { data } = await infoList(listData.value);
  console.log('列表', data);
  if (data) {
    pagination.itemCount = data.total;
    tableData.value = data.list;
    loading.value = false;
  }
}

function pickerChange() {
  listData.value.StartTime = dayjs(range.value[0]).format('YYYY-MM-DD HH:mm:ss');

  listData.value.EndTime = dayjs(range.value[1]).format('YYYY-MM-DD HH:mm:ss');
  console.log('时间', listData.value.StartTime, listData.value.EndTime);
  list();
}

function alarmLevelChang(e) {
  listData.value.alarmLevel = e;
  list();
}

function processingResultBlur() {
  console.log(96666, listData.value);
  list();
}

list();
const particulars = ref(false);
const particularsText = ref('');

function handleEditPwd(row) {
  particularsText.value = row.content;
  particulars.value = true;
}
const getPlatform = computed(() => {
  const { proxy }: any = getCurrentInstance();
  return proxy.getPlatform();
});
</script>

<template>
  <div class="h-full flex-col">
    <NForm ref="queryFormRef" :inline="!getPlatform" label-placement="left" :model="listData">
      <NFormItem path="status">
        <n-date-picker
          v-model:value="range"
          type="monthrange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd "
          clearable
          @update:value="pickerChange"
        />
      </NFormItem>
      <NFormItem :label="$t('generate.alarm-level')" path="status">
        <NSelect
          v-model:value="listData.alarmLevel"
          clearable
          class="w-200px"
          :options="options"
          @update:value="alarmLevelChang"
        />
      </NFormItem>
      <NFormItem :label="$t('generate.final-result')" path="status">
        <NSelect
          v-model:value="listData.processingResult"
          clearable
          class="w-200px"
          :options="dispose"
          @update:value="processingResultBlur"
        />
      </NFormItem>
    </NForm>
    <n-data-table
      remote
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :row-key="rowKey"
      virtual-scroll
      class="w-100% flex-1-hidden"
      @update:checked-row-keys="handleCheck"
    />
    <div class="flex gap-20px">
      <NButton @click="handleBatch">{{ $t('generate.batch-process') }}</NButton>
      <NButton @click="handleIgnore">{{ $t('generate.batch-ignore') }}</NButton>
    </div>
    <NModal
      v-model:show="particulars"
      preset="card"
      :title="$t('page.irrigation.time.log.detail')"
      :class="getPlatform ? 'w-90%' : 'w-800px'"
    >
      <div class="pop-up">
        <div>{{ $t('generate.alarm-content') }}</div>
        <div class="pop-up-content">
          {{ particularsText }}
        </div>
      </div>
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.pop-up {
  display: flex;
}

.pop-up-content {
  margin-left: 15px;
  width: 90%;
  height: 200px;
  padding: 10px;
  border: 1px solid rgb(215, 213, 213);
  border-radius: 10px;
}
</style>
