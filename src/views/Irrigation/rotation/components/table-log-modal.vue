<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { DataTableColumns, FormInst, PaginationProps } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { addUser, editUser, fetchUserList } from '@/service/api/auth';
import LogRunModal from './log-rundetail-modal.vue';
import { $t } from '~/src/locales';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 弹窗类型 add: 新增 edit: 编辑 */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: UserManagement.User | null;
}

const { bool: devicesVisible, setTrue: openDevicesModal } = useBoolean();
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
const closeModal = () => {
  modalVisible.value = false;
};

const formRef = ref<HTMLElement & FormInst>();

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

async function handleSubmit() {
  await formRef.value?.validate();
  let data: any;
  if (props.type === 'add') {
    data = await addUser(formModel);
  } else if (props.type === 'edit') {
    data = await editUser(formModel);
  }
  if (!data.error) {
    window.$message?.success(data.msg);
    emit('success');
  }
  closeModal();
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

function openDevicesModalFn() {
  openDevicesModal();
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    key: 'email',
    title: () => $t('page.irrigation.group.log.runTime'),
    align: 'center'
  },
  {
    key: 'name',
    title: () => $t('page.irrigation.group.log.operationType'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.log.runResult'),
    align: 'center'
  },
  {
    key: 'phone_number',
    title: () => $t('page.irrigation.group.log.detail'),
    align: 'center'
  },
  {
    key: 'actions',
    title: () => $t('common.action'),
    align: 'center',
    width: 120,
    render: () => {
      return (
        <NSpace justify={'center'}>
          <NButton type="info" quaternary size={'small'} onClick={() => openDevicesModalFn()}>
            {$t('page.irrigation.group.runDetail')}
          </NButton>
        </NSpace>
      );
    }
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
    :title="$t('page.irrigation.group.log.planDetail')"
    class="h-600px w-900px"
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
    <LogRunModal v-model:visible="devicesVisible" :edit-data="editData" @success="handleSubmit" />
  </NModal>
</template>

<style scoped></style>
