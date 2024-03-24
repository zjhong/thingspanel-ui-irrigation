<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import dayjs from 'dayjs';
import { DocumentOnePage24Regular, Timer16Regular } from '@vicons/fluent';
import { addMonths } from 'date-fns';
import { useLoading } from '@sa/hooks';
import { getTelemetryLogList, telemetryDataCurrent, telemetryDataPub } from '@/service/api';
// import { fetchTableData } from '@/api'; // 假设你有一个获取表格数据的 API
const props = defineProps<{
  id: string;
}>();
const showDialog = ref(false);
const showHistory = ref(false);
const formValue = ref('');
const operationType = ref('');
const sendResult = ref('');
const tableData = ref([]);
const tableData2 = ref([]);
const telemetryData = ref<DeviceManagement.telemetryData[]>([]);
const { loading, startLoading, endLoading } = useLoading();
const total = ref(0);
const total2 = ref(0);
const dateRange = ref<[number, number] | null>(null);
const message = useMessage();
const checkDateRange = value => {
  const [start, end] = value;
  if (start && end && addMonths(start, 1) < end) {
    dateRange.value = null;
    message.error('日期范围不能超过一个月');
  }
};
const refresh = () => {
  // 刷新逻辑
};

const operationOptions = [
  { label: '全部', value: '' },
  { label: '手动操作', value: '1' },
  { label: '触发操作', value: '2' }
  // 其他操作类型选项...
];
const resultOptions = [
  { label: '全部', value: '' },
  { label: '成功', value: '1' },
  { label: '失败', value: '2' }
  // 其他发送结果选项...
];
const cardHeight = ref(160); // 卡片的高度
const cardMargin = ref(10); // 卡片的间距
const log_page = ref(1);
const columns = [
  { title: '指令', key: 'data' },
  { title: '操作类型', key: 'operation_type' },
  { title: '操作用户', key: 'user_id' },
  { title: '操作时间', key: 'created_at', render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') },
  { title: '发送结果', key: 'status', render: row => (row.status === 1 ? '成功' : '失败') }
];
const columns2 = [
  { title: '时间', key: 'time', render: row => dayjs(row.time).format('YYYY-MM-DD HH:mm:ss') },
  { title: '数据标识符', key: 'identifier' },
  { title: '值', key: 'value' }
];

const openDialog = () => {
  showDialog.value = true;
};
const fetchData = async () => {
  startLoading();
  const { data, error } = await getTelemetryLogList({
    page: log_page.value,
    page_size: 5,
    device_id: props.id,
    operationType: operationType.value,
    sendResult: sendResult.value
  });
  if (!error) {
    tableData.value = data.value;
    console.log(data.count);
    total.value = Math.ceil(data.count / 5);
    endLoading();
  }
};

const fetchData2 = async (page = 1, export_excel = false) => {
  startLoading();
  const params = {
    page,
    page_size: 4,
    start_time: '', // 这里填入你的 start_time
    end_time: '', // 这里填入你的 end_time
    device_id: '', // 这里填入你的 device_id
    key: '', // 这里填入你的 key
    export_excel
  };
  console.log(params);
  // const { data, error } = await getDeviceConfigList(params);
  // if (!error) {
  //   tableData2.value = data.value;
  //   total.value = Math.ceil(data.count / 4);
  // }
  endLoading();
};
console.log(fetchData2);
const send = async () => {
  // 发送属性的逻辑...
  const { error } = await telemetryDataPub({
    device_id: props.id,
    value: formValue.value
  });
  if (!error) {
    showDialog.value = false;
    fetchData();
  }
};

const fetchTelemetry = async () => {
  const { data, error } = await telemetryDataCurrent(props.id);
  if (!error) {
    telemetryData.value = data;
  }
};
onMounted(() => {
  fetchData();
  fetchTelemetry();
});
fetchData();
</script>

<template>
  <n-card class="w-full">
    <!-- 第一行 -->
    <n-button type="primary" class="mb-4" @click="openDialog">下发控制</n-button>
    <n-modal v-model:show="showDialog" title="下发属性" class="w-[400px]">
      <n-card>
        <n-form>
          <n-form-item label="属性">
            <n-input v-model:value="formValue" type="textarea" />
          </n-form-item>
          <n-space align="end">
            <n-button @click="showDialog = false">取消</n-button>
            <n-button @click="send">发送</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showHistory" title="遥测历史数据" class="w-[600px]">
      <n-card>
        <n-flex justify="space-between" align="center">
          <n-flex justify="space-between" align="center">
            <n-date-picker v-model:value="dateRange" class="w-300px" type="daterange" @update:value="checkDateRange" />
            <n-button class="ml-2" @click="refresh">刷新</n-button>
          </n-flex>

          <n-button type="primary">导出</n-button>
        </n-flex>
        <div>
          <n-data-table :loading="loading" :columns="columns2" :data="tableData2" />
          <n-pagination :page-count="total2" :page-size="4" @update:page="fetchData" />
        </div>
      </n-card>
    </n-modal>
    <!-- 第二行 -->
    <n-card class="mb-4">
      <n-scrollbar style="max-height: 190px">
        <n-grid :x-gap="cardMargin" :y-gap="cardMargin" :cols="4">
          <n-gi v-for="i in telemetryData" :key="i.tenant_id">
            <n-card header-class="border-b h-36px mb-4" :title="i.key" hoverable :style="{ height: cardHeight + 'px' }">
              <NH4>{{ i.value }}{{ i.unit }}</NH4>
              <template #footer>
                <div class="flex justify-end">{{ dayjs(i.ts).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </template>
              <template #header-extra>
                <div class="h-24px w-120px flex items-center justify-end">
                  <NIcon size="24" @click="console.log((showHistory = true))">
                    <DocumentOnePage24Regular />
                  </NIcon>

                  <NDivider vertical />
                  <NIcon size="24">
                    <Timer16Regular />
                  </NIcon>
                </div>
              </template>
            </n-card>
          </n-gi>
        </n-grid>
      </n-scrollbar>
    </n-card>
    <!-- 第三行 -->
    <n-space>
      <n-select
        v-model:value="operationType"
        :options="operationOptions"
        style="width: 200px"
        @update:value="fetchData"
      />
      <n-select v-model:value="sendResult" :options="resultOptions" style="width: 200px" @update:value="fetchData" />
    </n-space>

    <!-- 第四行 -->

    <n-data-table :loading="loading" class="mt-4" :columns="columns" :data="tableData" :pagination="false" />
    <div class="mt-4 w-full flex justify-end">
      <n-pagination
        :page-count="total"
        :page-size="5"
        @update:page="
          page => {
            log_page = page;
            fetchData();
          }
        "
      />
    </div>
  </n-card>
</template>

<style scoped></style>
