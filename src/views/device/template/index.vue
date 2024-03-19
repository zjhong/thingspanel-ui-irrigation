<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { deleteDeviceTemplate, deviceTemplate, getDeviceTemplateDetail } from '@/service/api/device-template-model';
import TemplateModal from './components/template-modal.vue';
import { templateInfoData } from './utils';
import { useBoolean, useLoading } from '~/packages/hooks/src';

const { startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const queryParams = reactive({
  page: 1,
  page_size: 12,
  name: ''
});
const modalType = ref<'add' | 'edit'>('add');
const deviceTemplateList = ref([] as any[]);
const editData = ref<Api.Alarm.NotificationGroupList | null>(null);
const dataTotal = ref(0);

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 20,
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

const getData = async () => {
  startLoading();
  const res = await deviceTemplate(queryParams);
  if (!res.error) {
    deviceTemplateList.value = res.data.list;
    dataTotal.value = res.data.total;
  }
  endLoading();
};

const handleQuery = async () => {
  deviceTemplateList.value = [];
  await getData();
};

getData();

function handleAddTemplate() {
  openModal();
  modalType.value = 'add';
}

const handleEdit = async (id: string) => {
  openModal();
  modalType.value = 'edit';
  const res = await getDeviceTemplateDetail(id);
  if (res?.data) {
    editData.value = res.data;
    templateInfoData.value = res.data;
  }
};

const handleRemove = async (id: string) => {
  await deleteDeviceTemplate(id);
  window.$message?.info('已删除当前模板');
  getData();
};
</script>

<template>
  <div class="container">
    <NCard title="设备模板列表" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px">
        <NButton type="primary" @click="handleAddTemplate">添加设备模板</NButton>
        <div class="flex gap-16px">
          <NInput v-model:value="queryParams.name" placeholder="请输入模板名称" />
          <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>
        </div>
      </div>
      <div class="card flex">
        <template v-for="item in deviceTemplateList" :key="item.name">
          <div class="card-box gap-16px">
            <n-card :title="item.name" hoverable>
              <template v-for="tag in (item.label || '').split(',')" :key="tag">
                <div style="display: inline-block; margin: 0px 8px 8px 0px">
                  <NTag v-if="tag" class="gap-16px" size="small">{{ tag }}</NTag>
                </div>
              </template>

              <div class="flex justify-end gap-2">
                <NButton circle strong secondary @click.stop="handleEdit(item.id)">
                  <template #icon>
                    <icon-material-symbols:contract-edit-outline class="text-24px text-blue" />
                  </template>
                </NButton>
                <NButton strong secondary circle @click.stop="handleRemove(item.id)">
                  <template #icon>
                    <icon-material-symbols:delete-outline class="text-24px text-red" />
                  </template>
                </NButton>
              </div>
            </n-card>
          </div>
        </template>
      </div>
      <div class="pagination-box">
        <NPagination v-model:page="pagination.page" :item-count="dataTotal" @update:page="getData" />
      </div>
    </NCard>
    <TemplateModal v-model:visible="visible" :type="modalType" :edit-data="editData" @get-table-data="getData" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;

  .card {
    display: flex;
    flex-wrap: wrap;
  }

  .card-box {
    width: 23%;
    margin-bottom: 16px;
    margin-right: 16px;
  }

  .pagination-box {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
