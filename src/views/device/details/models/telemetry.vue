<script setup lang="ts">
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { telemetryDataCurrent } from '@/service/api';
// import { fetchTableData } from '@/api'; // 假设你有一个获取表格数据的 API
const props = defineProps<{
  id: string;
}>();
const showDialog = ref(false);
const formValue = ref('');
const operationType = ref('');
const sendResult = ref('');
const tableData = ref([]);
const telemetryData = ref<DeviceManagement.telemetryData[]>([]);
const total = ref(0);
const operationOptions = [
  { label: '全部', value: '' }
  // 其他操作类型选项...
];
const resultOptions = [
  { label: '全部', value: '' }
  // 其他发送结果选项...
];
const cardHeight = ref(160); // 卡片的高度
const cardMargin = ref(10); // 卡片的间距
const columns = [
  { title: '指令', key: 'command' },
  { title: '操作类型', key: 'operationType' },
  { title: '操作用户', key: 'operationUser' },
  { title: '操作时间', key: 'operationTime' },
  { title: '发送结果', key: 'sendResult' }
];
const openDialog = () => {
  showDialog.value = true;
};

const send = () => {
  // 发送属性的逻辑...
  console.log(formValue.value);
};
const fetchData = async (page: number = 1) => {
  // const { data, total: totalItems } = await fetchTableData({ page, pageSize: 5, operationType: operationType.value, sendResult: sendResult.value });
  // tableData.value = data;
  // total.value = totalItems;
  console.log(page, operationType.value, sendResult.value);
};
const fetchTelemetry = async () => {
  const { data, error } = await telemetryDataCurrent(props.id);
  if (!error) {
    telemetryData.value = data;
    console.log(data, '4324324');
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

    <!-- 第二行 -->
    <n-card class="mb-4">
      <n-scrollbar style="max-height: 190px">
        <n-grid :x-gap="cardMargin" :y-gap="cardMargin" :cols="4">
          <n-gi v-for="i in telemetryData" :key="i.tenant_id">
            <n-card :title="i.key" hoverable :style="{ height: cardHeight + 'px' }">
              <NH4>{{ i.value }}{{ i.unit }}</NH4>
              <template #footer>
                <div class="flex justify-end">{{ dayjs(i.ts).format('YYYY-MM-DD HH:mm:ss') }}</div>
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

    <n-data-table class="mt-4" :columns="columns" :data="tableData" :pagination="false" />
    <div class="mt-4 w-full flex justify-end">
      <n-pagination :total="total" :page-size="5" @update:page="fetchData" />
    </div>
  </n-card>
</template>

<style scoped></style>
