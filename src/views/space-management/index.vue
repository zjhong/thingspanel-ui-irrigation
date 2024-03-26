<script setup lang="tsx">
import { reactive, ref } from "vue";
import type { Ref } from "vue";
import { NButton, NPopconfirm, NSpace } from "naive-ui";
import type { DataTableColumns, PaginationProps } from "naive-ui";
import {
  dataServiceFlagLabels,
  dataServiceSignModeLabels,
  dataServiceStatusOptions,
} from "@/constants/business";
import { fetchDataServiceList } from "@/service/api_demo/management";
import type { ModalType } from "./components/table-action-modal.vue";
import TableActionModal from "./components/table-action-modal.vue";
import SecretKeyModal from "./components/secret-key-modal.vue";
import { useBoolean, useLoading } from "~/packages/hooks";
import { areasList, deleteArea, spacesList } from "@/service/api/equipment-map";
import { router } from "@/router";

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible } = useBoolean();
const { bool: secretKeyVisible, setTrue: openSecretKeyModal } = useBoolean();

const queryParams = reactive({
  name: "",
  status: null,
});

const tableData = ref<DataService.Data[]>([]);

function setTableData(data: DataService.Data[]) {
  tableData.value = data;
}

const params = reactive({
  limit: 100,
});

const spaces = ref([{ name: "", id: "" }]);
//区域详情列表
const detailOne: any = ref([]);

const detailTwo: any = ref([]);
//获取空间列表
async function getSpacesList() {
  const { data } = (await spacesList(params)) as any;
  spaces.value = data.rows;
  console.log("获取空间列表", spaces.value);
  getAreaList();
}
function getAreaList() {
  let dataList = { limit: 100, space_id: "" };
  spaces.value.map((item) => {
    console.log(item.id);
    dataList.space_id = item.id;
    const { data } = areasList(dataList) as any;
    console.log("获取区域列表", data);
    return data
  });
}

// async function getAreaDetail(id: any, index: number) {
//   const { data } = (await areaDetail(id)) as any;
//   if (index === 0) {
//     detailOne.value.push(data);
//   } else {
//     detailTwo.value.push(data);
//   }
// }
async function getTableData() {
  startLoading();
  const { data } = (await fetchDataServiceList()) as any;
  console.log(data);
  if (data) {
    setTimeout(() => {
      setTableData(data);
      endLoading();
    }, 1000);
  }
}

function RouterPush(url: string) {
  router.push(url);
}
const columns: Ref<DataTableColumns<DataService.Data>> = ref([
  {
    key: "image_url",
    title: "图片",
    align: "center",
    width: "120px",
  },
  {
    key: "name",
    title: "区域名称",
    align: "left",
  },
  {
    key: "irrigation_type",
    title: "灌溉类型",
    align: "left",
  },
  {
    key: "soil_type",
    title: "土壤类型",
    align: "left",
    render: (row) => {
      if (row.signMode) {
        return <span>{dataServiceSignModeLabels[row.signMode]}</span>;
      }
      return <span></span>;
    },
  },
  {
    key: "crop_type",
    title: "种植作物",
    align: "left",
  },
  {
    key: "water_requirement",
    title: "作物需水量",
    align: "left",
    render: (row) => {
      if (row.flag) {
        return <span>{dataServiceFlagLabels[row.flag]}</span>;
      }
      return <span></span>;
    },
  },
  {
    key: "area",
    title: "区域面积",
    align: "left",
  },
  {
    key: "area",
    title: "土壤参数",
    align: "left",
  },
  {
    key: "actions",
    title: "操作",
    align: "center",
    width: "300px",
    render: (row) => {
      return (
        <NSpace justify={"center"}>
          <NButton
            size={"small"}
            type="primary"
            onClick={() => handleViewKey(row.id)}
          >
            管理设备
          </NButton>
          <NButton
            size={"small"}
            type="primary"
            onClick={() => RouterPush("/system-management-user/equipment-map")}
          >
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteArea(row.id)}>
            {{
              default: () => "确认删除",
              trigger: () => (
                <NButton type="error" size={"small"}>
                  删除
                </NButton>
              ),
            }}
          </NPopconfirm>
        </NSpace>
      );
    },
  },
]) as Ref<DataTableColumns<DataService.Data>>;

const facilityColumns: Ref<DataTableColumns<DataService.Data>> = ref([
  {
    key: "name",
    title: "设备名称",
    align: "left",
  },
  {
    key: "irrigation_type",
    title: "设备编码",
    align: "left",
  },
  {
    key: "soil_type",
    title: "空间/区域",
    align: "left",
    render: (row) => {
      if (row.signMode) {
        return <span>{dataServiceSignModeLabels[row.signMode]}</span>;
      }
      return <span></span>;
    },
  },
  {
    key: "crop_type",
    title: "设备类型",
    align: "left",
  },
]) as Ref<DataTableColumns<DataService.Data>>;

const modalType = ref<ModalType>("add");

const editData = ref<DataService.Data | null>(null);

function handleDeleteArea(rowId: string) {
  deleteArea(rowId);
  window.$message?.success("删除成功");
  init();
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

/** 查看密钥 */
const secretKey = ref<string>("");

function handleViewKey(rowId: string) {
  secretKey.value = rowId;
  openSecretKeyModal();
}

function handleQuery() {
  init();
}

function init() {
  // getTableData();
  getSpacesList();
}

// 初始化
init();
</script>

<template>
  <div>
    <NCard title="空间管理" :bordered="false" class="rounded-8px shadow-sm">
      <div class="flex-col">
        <NForm
          inline
          label-placement="left"
          :model="queryParams"
        >
          <NFormItem label="空间名称" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem label="空间名称" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem label="作物" path="status">
            <NSelect
              v-model:value="queryParams.status"
              clearable
              class="w-200px"
              :options="dataServiceStatusOptions"
            />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px" type="primary" @click="handleQuery"
              >搜索</NButton
            >
          </NFormItem>
        </NForm>
      </div>
    </NCard>
    <div>
      <n-scrollbar style="max-height: 280px">
        <NCard v-for="(item, index) in spaces" :key="index">
          <div class="space-name">空间名称: {{ item.name }}</div>
          <NSpace>
            <NDataTable
              :scroll-x="1088"
              :columns="columns"
              :data="detailOne"
              :loading="loading"
              :pagination="pagination"
              class="flex-1-hidden"
            />
            <TableActionModal
              v-model:visible="visible"
              :type="modalType"
              :edit-data="editData"
              @get-table-data="getTableData"
            />
          </NSpace>
        </NCard>
      </n-scrollbar>
    </div>

    <NCard title="" :bordered="false" class="rounded-8px shadow-sm">
      <div class="flex-col">
        <NForm
          inline
          label-placement="left"
          :model="queryParams"
        >
          <NFormItem label="设备名称" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem label="设备编码" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem label="设备类型" path="status">
            <NSelect
              v-model:value="queryParams.status"
              clearable
              class="w-200px"
              :options="dataServiceStatusOptions"
            />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px mr-5" type="primary" @click="handleQuery"
              >搜索</NButton
            >
            <NButton class="w-72px" type="primary" @click="handleQuery"
              >重置</NButton
            >
          </NFormItem>
        </NForm>
        <NDataTable
          :scroll-x="300"
          :columns="facilityColumns"
          :data="detailTwo"
          :loading="loading"
          :pagination="pagination"
          class="flex-1-hidden w-200"
        />
        <TableActionModal
          v-model:visible="visible"
          :type="modalType"
          :edit-data="editData"
          @get-table-data="getTableData"
        />
      </div>
    </NCard>

    <SecretKeyModal
      v-model:visible="secretKeyVisible"
      :secret-key="secretKey"
    ></SecretKeyModal>
  </div>
</template>

<style scoped>
:deep(.n-space) {
  display: block !important;
}
.space-name {
  padding: 0 15px 15px 0;
  font-weight: 700;
}
</style>
