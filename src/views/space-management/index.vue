<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { router } from '@/router';
import { dataServiceFlagLabels, dataServiceSignModeLabels, dataServiceStatusOptions } from '@/constants/business';
import { fetchDataServiceList } from '@/service/api_demo/management';
import { areasList, deleteArea, spacesList } from '@/service/api/equipment-map';
import { $t } from '@/locales';
import type { ModalType } from './components/table-action-modal.vue';
import { useBoolean, useLoading } from '~/packages/hooks';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible } = useBoolean();

const queryParams = reactive({
  name: '',
  status: null
});

const tableData = ref<DataService.Data[]>([]);
const equipmentShow = ref(false);

function setTableData(data: DataService.Data[]) {
  tableData.value = data;
}

const params = reactive({
  limit: 100
});

const spaces = ref([{ name: '', id: '', rows: [] }]);
// 区域详情列表

const detailTwo: any = ref([]);

// 获取空间列表
async function getSpacesList() {
  const { data } = (await spacesList(params)) as any;
  spaces.value = data.rows;
  console.log('获取空间列表', spaces.value);
  getAreaList();
}

function getAreaList() {
  const dataList = { limit: 10, space_id: '' };
  spaces.value.map((item, index) => {
    console.log(item.id);
    dataList.space_id = item.id;
    const add: any = [];
    areasList(dataList).then(e => {
      if (e.data.rows) {
        spaces.value[index].rows = e.data.rows;
        console.log('区域表', spaces.value);
      }
      add.push(e);
    });
    return undefined;
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
    key: 'image_url',
    title: '图片',
    align: 'center',
    minWidth: '140px'
  },
  {
    key: 'name',
    title: '区域名称',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'irrigation_type',
    title: '灌溉类型',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'soil_type',
    title: '土壤类型',
    align: 'left',
    minWidth: '140px',
    render: row => {
      if (row.signMode) {
        return <span>{dataServiceSignModeLabels[row.signMode]}</span>;
      }
      return <span></span>;
    }
  },
  {
    key: 'crop_type',
    title: '种植作物',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'water_requirement',
    title: '作物需水量',
    align: 'left',
    minWidth: '140px',
    render: row => {
      if (row.flag) {
        return <span>{dataServiceFlagLabels[row.flag]}</span>;
      }
      return <span></span>;
    }
  },
  {
    key: 'area',
    title: '区域面积',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'area',
    title: '土壤参数',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    minWidth: '140px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleViewKey()}>
            管理设备
          </NButton>
          <NButton size={'small'} type="primary" onClick={() => RouterPush('/system-management-user/equipment-map')}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteArea(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<DataService.Data>>;

const facilityColumns: Ref<DataTableColumns<DataService.Data>> = ref([
  {
    key: 'name',
    title: '设备名称',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'irrigation_type',
    title: '设备编码',
    minWidth: '140px',
    align: 'left'
  },
  {
    key: 'soil_type',
    title: '空间/区域',
    minWidth: '140px',
    align: 'left',
    render: row => {
      if (row.signMode) {
        return <span>{dataServiceSignModeLabels[row.signMode]}</span>;
      }
      return <span></span>;
    }
  },
  {
    key: 'crop_type',
    minWidth: '140px',
    title: '设备类型',
    align: 'left'
  }
]) as Ref<DataTableColumns<DataService.Data>>;

const modalType = ref<ModalType>('add');

const editData = ref<DataService.Data | null>(null);

function handleDeleteArea(rowId: string) {
  deleteArea(rowId);
  window.$message?.success('删除成功');
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
  }
});

function handleViewKey() {
  equipmentShow.value = true;
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
    <NCard :title="$t('generate.space-management')" :bordered="false">
      <div class="flex-col">
        <NForm inline label-placement="left" :model="queryParams">
          <NFormItem :label="$t('generate.space-name')" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <!--
 <NFormItem label="空间名称" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
-->
          <NFormItem :label="$t('generate.crop')" path="status">
            <NSelect v-model:value="queryParams.status" clearable class="w-200px" :options="dataServiceStatusOptions" />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
          </NFormItem>
        </NForm>
      </div>
    </NCard>
    <div>
      <n-scrollbar style="max-height: 500px">
        <NCard v-for="(item, index) in spaces" :key="index">
          <div class="space-name">
            <span>{{ $t('generate.space-name') }}</span>
            : {{ item.name }}
          </div>
          <NDataTable :columns="columns" :data="item.rows" :loading="loading" :pagination="pagination" />

          <!--
 <TableActionModal
              v-model:visible="visible"
              :type="modalType"
              :edit-data="editData"
              @get-table-data="getTableData"
            />
-->
        </NCard>
      </n-scrollbar>
    </div>

    <NModal v-model:show="equipmentShow" preset="card" :title="$t('generate.device-management')" class="w-1200px">
      <div class="flex-col">
        <NForm inline label-placement="left" :model="queryParams">
          <NFormItem :label="$t('page.irrigation.group.deviceName')" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.group.deviceCode')" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.group.deviceType')" path="status">
            <NSelect v-model:value="queryParams.status" clearable class="w-200px" :options="dataServiceStatusOptions" />
          </NFormItem>
          <NFormItem>
            <NButton class="mr-5 w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
            <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.reset') }}</NButton>
          </NFormItem>
        </NForm>
        <NDataTable
          :scroll-x="300"
          :columns="facilityColumns"
          :data="detailTwo"
          :loading="loading"
          :pagination="pagination"
          class="w-200 flex-1-hidden"
        />
        <TableActionModal
          v-model:visible="visible"
          :type="modalType"
          :edit-data="editData"
          @get-table-data="getTableData"
        />
      </div>
    </NModal>
  </div>
</template>

<style scoped>
.space-name {
  padding: 0 15px 15px 0;
  font-weight: 700;
}

:deep(.n-space) {
  width: 100% !important;
}
</style>
