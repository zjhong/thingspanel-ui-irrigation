<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
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

const { loading } = useLoading(false);
export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  /** 点击协议 */
  (e: 'success'): void;
}

const emit = defineEmits<Emits>();
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

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

type FormModel = Pick<UserManagement.User, 'email' | 'name' | 'phone_number' | 'gender' | 'remark'> & {
  password: string;
  confirmPwd: string;
};

const formModel = reactive<FormModel>(createDefaultFormModel());

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    gender: null,
    phone_number: '',
    email: '',
    password: '',
    confirmPwd: '',
    remark: ''
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

const tableData = ref<UserManagement.User[]>([]);
function setTableData(data: UserManagement.User[]) {
  tableData.value = data;
}
async function getTableData() {
  const { data } = await fetchUserList(queryParams);
  if (data) {
    const list: UserManagement.User[] = data.list;
    setTableData(list);
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    key: 'email',
    title: () => $t('page.irrigation.group.detail.commandIssuanceTime'),
    align: 'center'
  },
  {
    key: 'name',
    title: () => $t('page.irrigation.group.detail.spaceOrArea'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.deviceName'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.orderNumber'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.detail.orderContent'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.detail.result'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.detail.detail'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.detail.actionType'),
    align: 'center'
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

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

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);

function init() {
  getTableData();
}

// 初始化
init();
</script>

<template>
  <NModal
    v-model:show="modalVisible"
    preset="card"
    :title="$t('page.irrigation.group.runDetail')"
    class="h-600px w-1000px"
  >
    <div class="h-full flex-col">
      <NDataTable
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :flex-height="true"
        class="flex-1-hidden"
      />
    </div>
  </NModal>
</template>

<style scoped></style>
