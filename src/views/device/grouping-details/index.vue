<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type DataTableColumns, NButton, NDataTable, type PaginationProps, useMessage } from 'naive-ui';
import { deleteDeviceGroup, deviceGroupDetail, deviceList, getDeviceGroup } from '@/service/api/device';
import { AddOrEditDevices } from '@/views/device/grouping/components';

import { createNoSelectDeviceColumns, group_columns } from '@/views/device/modules/all-columns';
import useLoadingEmpty from '@/hooks/common/use-loading-empty';
import DeviceSelectList from '@/views/device/grouping-details/modules/device-select-list.vue';

const group_data = ref([]);
const device_data = ref<DeviceManagement.DeviceData[]>([]);

const { loading, startLoading, endLoading } = useLoadingEmpty(false);
const route = useRoute();
const id = route.query.id;
const isEdit = ref(true);
const the_modal1 = ref();
const the_modal2 = ref();

const editData = ref({ id: '', parent_id: '', name: '', description: '' });

const addChildData = ref({ id: '', parent_id: id as string, name: '', description: '' });
const details_data = ref({
  detail: {
    created_at: '',
    description: '',
    id: '',
    name: '',
    parent_id: '',
    remark: '',
    tenant_id: '',
    tier: 0,
    updated_at: ''
  },
  tier: {
    group_path: ''
  }
});
const message = useMessage();

const queryParams = reactive<{ parent_id: string; page: number; page_size: number }>({
  parent_id: '',
  page: 1,
  page_size: 10
});

const getDetails = async (tid: string) => {
  if (!id) {
    message.error('没有传人的分组id');
  } else {
    queryParams.parent_id = tid;
    startLoading();
    const { data, error } = await deviceGroupDetail({ id: tid });

    if (!error && data) {
      details_data.value = data;
      editData.value.id = data.detail.id;
      editData.value.description = data.detail.description;
      editData.value.name = data.detail.name;
      editData.value.parent_id = data.detail.parent_id;
    }

    const res2 = await getDeviceGroup(queryParams);
    group_data.value = res2.data.list;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    group_pagination.pageCount = Math.ceil(res2.data.total / 10);

    endLoading();
  }
};
const group_pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    group_pagination.page = page;
    queryParams.page = page;
    getDetails(id as string);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getDeviceList();
  },
  onUpdatePageSize: (pageSize: number) => {
    group_pagination.pageSize = pageSize;
    group_pagination.page = 1;
    queryParams.page = 1;
    queryParams.page_size = pageSize;
    getDetails(id as string);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getDeviceList();
  }
});
const router = useRouter();
const viewDetails = (rid: string) => {
  router.push(`/device/grouping-details?id=${rid}`);
};
// Function to delete a device group
const deleteItem = async (rid: string) => {
  await deleteDeviceGroup({ id: rid });
  await getDetails(id as string);
};
const group_column = group_columns(viewDetails, deleteItem);
const showGroupModal = () => {
  isEdit.value = true;
  if (the_modal2.value) {
    the_modal2.value.showModal = true;
  }
};
const showGroupModalChild = () => {
  if (the_modal1.value) {
    the_modal1.value.showModal = true;
  }
};

const showGroupDeviceModal = ref(false);
const handleChildChange = (newValue: boolean) => {
  showGroupDeviceModal.value = newValue;
};

const queryParams2 = reactive<{ group_id: string; page: number; page_size: number }>({
  group_id: id as string,
  page: 1,
  page_size: 5
});
const getDeviceList = async () => {
  const res = await deviceList(queryParams2);
  device_data.value = res.data?.list as DeviceManagement.DeviceData[];
  if (res?.data?.total) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    devicePagination.pageCount = Math.ceil(res?.data?.total / 5);
  }
};
const refresh_data = (newValue: boolean) => {
  if (newValue) {
    getDeviceList();
  }
};
const devicePagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 5,
  onChange: (page: number) => {
    devicePagination.page = page;
    queryParams2.page = page;
    getDeviceList();
  }
});
const viewDevicsseDetails = rid => {
  console.log(rid);
};
const deleteDeviceItem = rid => {
  console.log(rid);
};
const deviceColumns: DataTableColumns<DeviceManagement.DeviceData> = createNoSelectDeviceColumns(
  viewDevicsseDetails,
  deleteDeviceItem
);
onMounted(async () => {
  await getDetails(id as string);
  await getDeviceList();
});
watch(
  () => route.query,
  newSystemName => {
    if (newSystemName.id) {
      getDetails(newSystemName.id as string);
    }
  }
);
</script>

<template>
  <div>
    <NSpace vertical :size="16">
      <NCard :title="details_data.detail.name" style="margin-bottom: 16px">
        <NTabs type="line" animated>
          <NTabPane name="详情" tab="详情">
            <NDescriptions label-placement="top" bordered :column="6">
              <NDescriptionsItem>
                <template #label>分组层级</template>
                {{ details_data.tier.group_path }}
              </NDescriptionsItem>
              <NDescriptionsItem>
                <template #label>分组ID</template>
                {{ details_data.detail.id }}
              </NDescriptionsItem>
              <NDescriptionsItem>
                <template #label>描述</template>
                {{ details_data.detail.description }}
              </NDescriptionsItem>
              <NDescriptionsItem>
                <template #label>创建时间</template>
                {{ details_data.detail.created_at }}
              </NDescriptionsItem>
            </NDescriptions>
            <NDivider title-placement="left">子分组</NDivider>
            <NSpace>
              <NButton type="primary" @click="showGroupModalChild">添加子分组</NButton>
            </NSpace>
            <NSpace class="mt4">
              <NDataTable
                :columns="group_column"
                :data="group_data"
                :loading="loading"
                :pagination="group_pagination"
                class="h-auto"
              ></NDataTable>
            </NSpace>

            <NDivider title-placement="left">设备</NDivider>
            <NSpace class="mb6">
              <NButton type="primary" @click="showGroupDeviceModal = true">添加设备到分组</NButton>
            </NSpace>

            <NDataTable :columns="deviceColumns" :data="device_data" :loading="loading" class="h-auto"></NDataTable>
            <NFlex justify="end" class="mt-4">
              <NPagination
                v-model:page="devicePagination.page"
                v-model:page-size="devicePagination.pageSize"
                :page-count="devicePagination.pageCount"
                @update:page="devicePagination.onChange"
              />
            </NFlex>

            <AddOrEditDevices
              ref="the_modal1"
              :is-edit="false"
              :edit-data="addChildData"
              is-pid-no-edit
              :refresh-data="
                () => {
                  getDetails(id as string);
                }
              "
            />
          </NTabPane>

          <NTabPane name="编辑" tab="设置">
            <NButton type="primary" @click="showGroupModal">编辑</NButton>

            <AddOrEditDevices
              ref="the_modal2"
              :is-edit="true"
              :edit-data="editData"
              :refresh-data="
                () => {
                  getDetails(id as string);
                }
              "
            />
          </NTabPane>
        </NTabs>
      </NCard>
    </NSpace>

    <NModal v-model:show="showGroupDeviceModal">
      <NCard style="width: 800px" title="添加设备到分组" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <DeviceSelectList :group_id="id as string" @closed_modal="handleChildChange" @refresh_data="refresh_data" />
      </NCard>
    </NModal>
  </div>
</template>

<style scoped></style>
