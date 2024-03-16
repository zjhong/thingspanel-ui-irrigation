<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { userStatusOptions } from '@/constants/business';
import { fetchUserList } from '@/service/api/auth';
import TableActionModal from './components/table-action-modal.vue';
import TableLogModal from './components/table-log-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
import { $t } from '~/src/locales';
// import ColumnSetting from './components/column-setting.vue'

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const { bool: logVisible, setTrue: openLogModal } = useBoolean();

type QueryFormModel = Pick<UserManagement.User, 'email' | 'name' | 'status'> & {
  page: number;
  page_size: number;
};

const queryParams = reactive<QueryFormModel>({
  email: null,
  name: null,
  status: null,
  page: 1,
  page_size: 10
});

const tableData = ref<UserManagement.User[]>([]);

function setTableData(data: UserManagement.User[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await fetchUserList(queryParams);
  if (data) {
    const list: UserManagement.User[] = data.list;
    setTableData(list);
    endLoading();
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    key: 'email',
    title: () => $t('page.irrigation.areaOrSpace'),
    align: 'center'
  },
  {
    key: 'name',
    title: () => $t('page.irrigation.time.planName'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.controlType'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.time.repeatTime'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.time.orderCode'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.time.irrigationTime'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.time.doorOpeing'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.planStatus'),
    align: 'center'
  },
  {
    key: 'actions',
    width: 350,
    title: () => $t('common.action'),
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton quaternary type="info" size={'small'} onClick={() => handleEditPwd(row.id)}>
            {$t('page.irrigation.distribute')}
          </NButton>
          <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
            {$t('common.delete')}
          </NButton>
          <NButton quaternary type="primary" size={'small'} onClick={() => handOpenLogModal()}>
            {$t('page.irrigation.log')}
          </NButton>
          <NButton quaternary type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
            {$t('common.cancel')}
          </NButton>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleEditPwd(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

function handOpenLogModal() {
  openLogModal();
}

// async function handleDeleteTable(rowId: string) {
//   const data = await delUser(rowId);
//   if (!data.error) {
//     window.$message?.success($t('common.deleteSuccess'));
//     getTableData();
//   }
// }

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
    queryParams.page = page;
    getTableData();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    queryParams.page = 1;
    queryParams.page_size = pageSize;
    getTableData();
  }
});

function handleQuery() {
  init();
}

function handleReset() {
  Object.assign(queryParams, {
    email: undefined,
    name: undefined,
    status: undefined,
    page: 1
  });
  handleQuery();
}

function init() {
  getTableData();
}

// 初始化
init();
</script>

<template>
  <div class="overflow-auto">
    <NCard :title="$t('page.irrigation.time.name')" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NForm ref="queryFormRef" inline label-placement="left" :model="queryParams">
          <NFormItem :label="$t('page.irrigation.areaOrSpace')" path="status">
            <NSelect v-model:value="queryParams.status" clearable class="w-200px" :options="userStatusOptions" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.diviceName')" path="email">
            <NInput v-model:value="queryParams.email" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.controlType')" path="status">
            <NSelect v-model:value="queryParams.status" clearable class="w-200px" :options="userStatusOptions" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.planStatus')" path="status">
            <NSelect v-model:value="queryParams.status" clearable class="w-200px" :options="userStatusOptions" />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
            <NButton class="ml-20px w-72px" type="primary" @click="handleReset">{{ $t('common.reset') }}</NButton>
          </NFormItem>
        </NForm>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleAddTable">
              <IconIcRoundPlus class="mr-4px text-20px" />
              {{ $t('page.irrigation.addIrrigationPlan') }}
            </NButton>
          </NSpace>
        </NSpace>
        <NDataTable
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          :flex-height="true"
          class="flex-1-hidden"
        />
        <TableActionModal v-model:visible="visible" :type="modalType" :edit-data="editData" @success="getTableData" />
        <TableLogModal v-model:visible="logVisible" :edit-data="editData"></TableLogModal>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
