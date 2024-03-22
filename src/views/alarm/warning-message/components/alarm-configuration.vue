<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-17 16:22:54
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-20 19:48:53
-->
<script setup lang="tsx">
import { reactive, ref } from "vue";
import type { Ref } from "vue";
import { NButton, NSpace,useMessage } from "naive-ui";
import dayjs from "dayjs";
import type {
  DataTableColumns,
  PaginationProps,
  DataTableRowKey,
} from "naive-ui";
import {
  infoList,
  processingOperation,
  batchProcessing,
} from "@/service/api/alarm";

const loading = ref(false);
const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const rowKey = (row: DeviceManagement.DeviceData) => row.id;
const message = useMessage();
const options = ref([
  {
    label: "高",
    value: "H",
  },
  {
    label: "中",
    value: "M",
  },
  {
    label: "低",
    value: "L",
  },
]);
const dispose = ref([
  {
    label: "未处理",
    value: "UND",
  },
  {
    label: "已处理",
    value: "DOP",
  },
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
  },
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
    type: "selection",
    disabled(row: any) {
      return row.name === "Edward King 3";
    },
  },
  {
    key: "alarm_time",
    title: "告警时间",
    align: "center",
    width:"200",
    render(row: {
      id: string;
      name: string;
      description: string;
      created_at: string;
      [key: string]: any;
    }) {
      return dayjs(row.alarm_time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    key: "name",
    title: "告警名称",
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    key: "alarm_level",
    title: "级别",
    align: "center",
    render(row) {
      if (row.alarm_level === "H") {
        return "高";
      } else if (row.alarm_level === "M") {
        return "中";
      } else {
        return "低";
      }
    },
  },
  {
    key: "description",
    title: "告警描述",
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    key: "processing_result",
    title: "处理结果",
    align: "center",
    render(row) {
      if (row.alarm_level === "DOP") {
        return "已处理";
      } else if (row.alarm_level === "UND") {
        return "未处理";
      } else {
        return "已忽略";
      }
    },
  },
  {
    key: "processor_name",
    title: "处理人",
    align: "center",
  },

  {
    key: "actions",
    width: 350,
    title: "操作",
    align: "center",
    render: (row) => {
      return (
        <NSpace justify={"center"}>
          <NButton
            type="primary"
            size={"small"}
            onClick={() => handleEditPwd(row.id)}
          >
            详情
          </NButton>
          <NButton
            type="warning"
            size={"small"}
            onClick={() => handleEditTable(row.id, "UND")}
          >
            处理
          </NButton>
          <NButton
            size={"small"}
            onClick={() => handOpenLogModal(row.id, "IGN")}
          >
            忽略
          </NButton>
        </NSpace>
      );
    },
  },
]) as Ref<DataTableColumns<ColumnsData>>;
const paramsData = ref({
  id: "",
  processing_result: "",
});
/**
 * 处理
 */
async function disposeData() {
  loading.value = true;
  const { data } = await processingOperation(paramsData.value);
  if (data){
    loading.value = false;
    message.success("操作成功")
  } else{
    message.error("操作失败");
    loading.value = false;
  }
}
function handleEditPwd(rowId: string) {
  console.log(1111);
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

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys;
  console.log("piliang", checkedRowKeysRef.value);
  batchData.value.id = checkedRowKeysRef.value;
}
/**
 * @description: 批量处理
 */
const batchData = ref({
  id: ref<DataTableRowKey[]>([]),
  processing_result: "",
  processing_instructions: "测试",
});
async function batchProcessings() {
  const { data } = await batchProcessing(batchData.value);
  console.log(data);
  if(!data){
    loading.value = false;
    message.success("批量操作成功")
  }else{
    message.error("批量操作失败");
    loading.value = false;
  }
}
function handleBatch() {
  batchData.value.processing_result = "UND";
  batchProcessings();
}
/**
 * @description: 批量忽略
 */
function handleIgnore() {
  batchData.value.processing_result = "IGN";
  batchProcessings();
}

const listData = ref({
  alarmLevel: "",
  processingResult: "",
  StartTime: "",
  EndTime: "",
  page: 1,
  page_size: 10,
});

const range = ref<[number, number]>([1183135260000, Date.now()]);
const tableData = ref<ColumnsData[]>([]);

/**
 * 告警信息列表
 */
async function list() {
  loading.value = true;
  const { data } = await infoList(listData.value);
  console.log("列表", data);
  if (data) {
    pagination.itemCount = data.total;
    tableData.value = data.list;
    loading.value = false;
  }
}

function pickerChange() {
  listData.value.StartTime = dayjs(range.value[0]).format(
    "YYYY-MM-DD HH:mm:ss",
  );

  listData.value.EndTime = dayjs(range.value[1]).format("YYYY-MM-DD HH:mm:ss");
  console.log("时间", listData.value.StartTime, listData.value.EndTime);
  list();
}
function alarmLevelChang(e) {
  listData.value.alarmLevel=e
  list();
}
function processingResultBlur() {
  console.log(96666, listData.value);
  list();
}
list();
</script>

<template>
  <div class="overflow-hidden">
    <NCard NCard :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NForm
          ref="queryFormRef"
          inline
          label-placement="left"
          :model="listData"
        >
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
          <NFormItem label="告警级别" path="status">
            <NSelect
              v-model:value="listData.alarmLevel"
              clearable
              class="w-200px"
              :options="options"
              @update:value="alarmLevelChang"
            />
          </NFormItem>
          <NFormItem label="处理结果" path="status">
            <NSelect
              v-model:value="listData.processingResult"
              clearable
              class="w-200px"
              :options="dispose"
              @update:value="processingResultBlur"
            />
          </NFormItem>
        </NForm>
      </div>
      <n-space vertical>
        <n-data-table
          remote
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :row-key="rowKey"
          @update:checked-row-keys="handleCheck"
          virtual-scroll
          :max-height="250"
        />
        <n-space>
          <n-button @click="handleBatch">批量处理</n-button>
          <n-button @click="handleIgnore">批量忽略</n-button>
        </n-space>
      </n-space>
    </NCard>
  </div>
</template>

<style scoped></style>
