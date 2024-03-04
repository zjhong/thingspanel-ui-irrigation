<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {NButton, NDataTable, type PaginationProps, useMessage} from 'naive-ui';
import {deleteDeviceGroup, deviceGroupDetail, getDeviceGroup} from '@/service/api/device';
import {AddOrEditDevices} from "@/views/device/grouping/components";

import {group_columns} from "@/views/device/modules/all-columns";
import useLoadingEmpty from "@/hooks/common/use-loading-empty";
import {useRouterPush} from "@/hooks/common/router";


const group_data = ref([]);
const {loading, startLoading, endLoading, empty, setEmpty} = useLoadingEmpty(false)
const route = useRoute();
const id = route.query.id;

const isEdit = ref(true);
const the_modal1 = ref();
const the_modal2 = ref();
const editData = ref({id: '', parent_id: '', name: '', description: ''})

const addChildData = ref({id: '', parent_id: id, name: '', description: ''})
const details_data = ref({
  detail: {
    created_at: "",
    description: "",
    id: "",
    name: "",
    parent_id: "",
    remark: "",
    tenant_id: "",
    tier: 0,
    updated_at: "",
  },
  tier: {
    group_path: "",
  }
});
const message = useMessage();
const {routerPushByKey} = useRouterPush();

const viewDetails = (id: string) => {


  routerPushByKey('device_grouping-details', {query: {id: id}})

}
// Function to delete a device group
const deleteItem = async (rid: string) => {
  await deleteDeviceGroup({id: rid});
  await getDetails(id);
};
const group_column = group_columns(viewDetails, deleteItem)

const queryParams = reactive<{ parent_id: string; page: number; page_size: number; }>({
  parent_id: '',
  page: 1,
  page_size: 10
});

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
    queryParams.page = page;
    getDetails(id);
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    queryParams.page = 1;
    queryParams.page_size = pageSize;
    getDetails(id);
  }
});


const getDetails = async (tid) => {

  if (!id) {
    message.error('没有传人的分组id');
  } else {
    queryParams.parent_id = tid
    startLoading()
    const {data, error} = await deviceGroupDetail({id: tid});

    if (!error && data) {
      details_data.value = data
      editData.value.id = data.detail.id
      editData.value.description = data.detail.description
      editData.value.name = data.detail.name
      editData.value.parent_id = data.detail.parent_id
    }

    const res2 = await getDeviceGroup(queryParams);


    group_data.value = res2.data.list;
    setEmpty(!res2.data.list.length);
    pagination.pageCount = Math.ceil(res2.data.total / 10);

    endLoading()
  }
};
const showModal = () => {
  isEdit.value = true
  if (the_modal2.value) {
    the_modal2.value.showModal = true;
  }
};
const showModalChild = () => {

  if (the_modal1.value) {
    the_modal1.value.showModal = true;
  }
};

onMounted(() => {
  getDetails(id)
})
watch(() => route.query, newSystemName => {

  console.log(newSystemName.id, "8585858")
  if (newSystemName.id) {
    getDetails(newSystemName.id);
  }

})
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="details_data.detail.name" style="margin-bottom: 16px">
      <NTabs type="line" animated>
        <NTabPane name="详情" tab="详情">

          <n-descriptions label-placement="top" bordered :column="6">
            <n-descriptions-item>
              <template #label>
                分组层级
              </template>
              {{ details_data.tier.group_path }}
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>
                分组ID
              </template>
              {{ details_data.detail.id }}
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>
                描述
              </template>
              {{ details_data.detail.description }}
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>
                创建时间
              </template>
              {{ details_data.detail.created_at }}
            </n-descriptions-item>
          </n-descriptions>
          <n-divider title-placement="left">
            子分组
          </n-divider>
          <n-space>
            <NButton type="primary" @click="showModalChild"> 添加子分组</NButton>
          </n-space>
          <n-space class="mt4">
            <LoadingEmptyWrapper class="h-200px" :loading="loading" :empty="empty">
              <NDataTable :columns="group_column" :data="group_data" :loading="loading" :pagination="pagination"
                          class="h-auto"></NDataTable>
            </LoadingEmptyWrapper>
          </n-space>

          <n-divider title-placement="left">
            设备
          </n-divider>
          <AddOrEditDevices ref="the_modal1" :is-edit="false" :editData='addChildData' :isPidNoEdit="true"
                            :refresh-data="()=>{getDetails(id)}"/>
        </NTabPane>

        <NTabPane name="编辑" tab="设置">
          <NButton type="primary" @click="showModal">编辑</NButton>

          <AddOrEditDevices ref="the_modal2" :is-edit="true" :editData='editData' :refresh-data="()=>{getDetails(id)}"/>
        </NTabPane>

      </NTabs>

    </NCard>
  </NSpace>
</template>

<style scoped></style>
