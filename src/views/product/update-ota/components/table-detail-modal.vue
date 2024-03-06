<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import { NButton, NSpace } from 'naive-ui';
import { $t } from '@/locales';
import type { Ref } from 'vue';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { editOtaTaskDetail, getOtaTaskDetail } from '@/service/product/update-ota';
export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 弹窗类型 add: 新增 edit: 编辑 */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: otaRecord | null;
  selectedKeys: string[];
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null,
  selectedKeys: () => []
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  /** 点击协议 */
  (e: 'success', data: any): void;
  (e: 'update:selectedKeys', data: any[]): void;
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

// (e: 'update:selectedKeys', selectedKeys: string[]): void;

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: $t('page.product.list.addProduct'),
    edit: '任务详情'
  };
  return titles[props.type];
});



const formModel = reactive<productAdd>(createDefaultFormModel() as productAdd);



function createDefaultFormModel() {
  return {

  };
}

function handleUpdateFormModel(model: Partial<otaRecord>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      handleUpdateFormModel(props.editData as productAdd);
    }
  };

  handlers[props.type]();
}
const backupData = ref([]);
watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    } else {
      backupData.value = JSON.parse(JSON.stringify(props.selectedKeys));
    }
  }
);
const { loading, startLoading, endLoading } = useLoading(false);

const queryParams = reactive({
  name: '',
  product_id: '',
  page: 1,
  page_size: 10
});
const tableData = ref<UpgradeTaskDetail[]>([]);
function setTableData(data: UpgradeTaskDetail[]) {
  tableData.value = data;
}
function handleQuery() {
  init();
}
function handleReset() {
  Object.assign(queryParams, {
    name: '',
    product_id: '',
    page: 1
  });
  handleQuery();
}
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
const stateData = ref({});
async function getTableData() {
  startLoading();
  const { data } = await getOtaTaskDetail(queryParams);
  if (data) {
    const list: UpgradeTaskDetail[] = data.list;
    stateData.value = {};
    const statistics = data.statistics || [];
    statistics.forEach((item: any) => {
      stateData.value[item.status] = item.count;
    });
    setTableData(list);
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size);
    endLoading();
  }
}
const toUpdate = async ({ id }, action: number) => {
  const data = await editOtaTaskDetail({ id, action })
  if (!data.error) {
    window.$message?.success(data.msg || data.message || '操作成功');
  }
}
const columns: Ref<DataTableColumns<UpgradeTaskDetail>> = ref([

  {
    key: 'name',
    title: '设备名'
  },
  {
    key: 'current_version',
    title: '当前版本号'
  },
  {
    key: 'version',
    title: '目标版本号'
  },
  {
    key: 'steps',
    title: '升级进度'
  },
  {
    key: 'updated_at',
    title: '状态更新时间'
  },
  {
    key: 'status',
    title: '状态',
    render: (row: UpgradeTaskDetail) => {
      return row.status === 1 ? '待推送' : row.status === 2 ? '已推送' : row.status === 3 ? '升级中' : row.status === 4 ? '升级成功' : row.status === 5 ? '升级失败' : row.status === 6 ? '已取消' : '未知';
    }
  },
  {
    key: 'status_description',
    title: '状态详情'
  },
  {
    key: 'actions',
    title: $t('common.action'),
    align: 'center',
    render: (row) => {
      return (
        <NSpace justify={'center'}>
          {/* 1-待推送 2-已推送 3-升级中 修改为已取消，前端传6
          5-升级失败 修改为待推送，前端传1
          4-升级成功 6-已取消 不修改 */}
          {row.status === 5 && <NButton size={'small'} type="primary" onClick={() => { toUpdate(row, 1) }}>
            {'重升级'}
          </NButton>}
          {row.status === 6 && <NButton size={'small'} onClick={() => { }}>
            {'已取消'}
          </NButton>}
          {row.status === 4 && <NButton size={'small'} type="success">
            {'升级成功'}
          </NButton>}

          {(row.status === 1 || row.status === 2 || row.status === 3) && <NButton v-else size={'small'} type="primary" onClick={() => { toUpdate(row, 6) }}>
            {'取消升级'}
          </NButton>}
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UpgradeTaskDetail>>;

function init() {
  getTableData();
}

// 初始化
init();

</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-1200px">
    <div class="overflow-hidden h-800px">
      <div class="flex-col h-full">
        <NGrid :cols="24" x-gap="12px">
          <NGridItem span="3">
            <!-- 状态态1-待推送2-已推送3-升级中4-升级成功-5-升级失败-6已取消 -->
            <NCard title="所有状态" size="small">
              {{ stateData[0] || '-' }}
            </NCard>
          </NGridItem>
          <NGridItem span="3">
            <NCard title="待推送" size="small">
              {{ stateData[1] || '-' }}
            </NCard>
          </NGridItem>
          <NGridItem span="3">
            <NCard title="已推送" size="small">
              {{ stateData[2] || '-' }}
            </NCard>
          </NGridItem>
          <NGridItem span="3">
            <NCard title="升级中" size="small">
              {{ stateData[3] || '-' }}
            </NCard>
          </NGridItem>
          <NGridItem span="3">
            <NCard title="升级成功" size="small">
              {{ stateData[4] || '-' }}
            </NCard>
          </NGridItem>
          <NGridItem span="3">
            <NCard title="升级失败" size="small">
              {{ stateData[5] || '-' }}
            </NCard>
          </NGridItem>
          <NGridItem span="3">
            <NCard title="已取消" size="small">
              {{ stateData[6] || '-' }}
            </NCard>
          </NGridItem>
        </NGrid>
        <NForm ref="queryFormRef" class="mt-10px" inline label-placement="left" :model="queryParams">
          <NFormItem :label="'设备名称'" path="name">
            <NInput v-model:value="queryParams.name" />
          </NFormItem>
          <NFormItem>
            <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t("common.search") }}</NButton>
            <NButton class="w-72px ml-20px" type="primary" @click="handleReset">{{ $t("common.reset") }}</NButton>
          </NFormItem>
        </NForm>
        <NDataTable size="small" remote :columns="columns" :data="tableData" :loading="loading" :pagination="pagination"
          flex-height class="flex-1-hidden" />
      </div>
    </div>
  </NModal>
</template>

<style scoped></style>
