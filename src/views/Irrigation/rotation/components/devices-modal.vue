<script setup lang="tsx">
import { computed, reactive, ref } from 'vue';
import { NButton, NSpace } from 'naive-ui';
import type { PaginationProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
// import { controlTypeOptions } from '@/constants/business';
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
const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

const { startLoading, endLoading } = useLoading(false);

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
const closeModal = () => {
  modalVisible.value = false;
};

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
      :title="$t('page.irrigation.rotation.chooseDevice')"
      class="w-300px"
    >
      <div class="h-full flex-col">
        <NForm ref="queryFormRef" label-placement="left" :label-width="80" :model="queryParams">
          <NFormItem :label="$t('page.irrigation.group.detail.spaceOrArea')" path="email">
            <NSelect v-model:value="queryParams.status" clearable class="w-150px" :options="[]" />
          </NFormItem>
          <NFormItem :label="$t('page.irrigation.time.device')" path="email">
            <NSelect v-model:value="queryParams.status" clearable class="w-150px" :options="[]" />
          </NFormItem>
          <NSpace class="w-full pt-16px" :size="24" justify="end">
            <NButton class="w-72px" @click="closeModal">{{ $t('common.cancel') }}</NButton>
            <NButton class="w-72px" type="primary" @click="handleReset">{{ $t('common.confirm') }}</NButton>
          </NSpace>
        </NForm>
      </div>
    </NModal>
  </div>
</template>

<style scoped></style>
