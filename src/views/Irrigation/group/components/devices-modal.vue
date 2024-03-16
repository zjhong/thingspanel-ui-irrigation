<script setup lang="tsx">
import { computed, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchUserList } from '@/service/api/auth';
import { $t } from '~/src/locales';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 弹窗类型 add: 新增 edit: 编辑 */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: UserManagement.User | null;
}

const controlTypeOptions = ref();

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

const { loading, startLoading, endLoading } = useLoading(false);

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

const checkedRowKeys = ref<string[]>([]);
const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    type: 'selection'
  },
  {
    key: 'email',
    title: () => $t('page.irrigation.group.deviceName'),
    align: 'center'
  },
  {
    key: 'name',
    title: () => $t('page.irrigation.group.deviceCode'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.detail.spaceOrArea'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.deviceType'),
    align: 'center'
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

interface Emits {
  (e: 'update:visible', visible: boolean): void;

  /** 点击协议 */
  (e: 'success'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

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
    <NModal
      v-model:show="modalVisible"
      preset="card"
      :title="$t('page.irrigation.group.chooseDevices')"
      class="h-750px w-1200px"
    >
      <div class="h-full flex-col">
        <NForm ref="queryFormRef" inline label-placement="left" :model="queryParams">
          <NFormItem :label="$t('page.irrigation.group.deviceName')" path="email">
            <NInput v-model:value="queryParams.status" class="important-w-150px" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.group.deviceCode')" path="email">
            <NInput v-model:value="queryParams.status" class="important-w-150px" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.group.detail.spaceOrArea')" path="email">
            <NSelect v-model:value="queryParams.status" clearable class="w-150px" :options="controlTypeOptions" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.group.deviceType')" path="email">
            <NSelect v-model:value="queryParams.status" clearable class="w-150px" :options="controlTypeOptions" />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
            <NButton class="ml-20px w-72px" type="primary" @click="handleReset">{{ $t('common.reset') }}</NButton>
          </NFormItem>
        </NForm>
        <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          :row-key="item => item.id"
          :flex-height="true"
          class="flex-1-hidden"
        />
      </div>
    </NModal>
  </div>
</template>

<style scoped></style>
