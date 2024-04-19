<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { Delete20Regular } from '@vicons/fluent';
import { deleteDeviceTemplate, deviceTemplate } from '@/service/api/device-template-model';
import TemplateModal from './components/template-modal.vue';
import { useBoolean, useLoading } from '~/packages/hooks/src';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 20,
  pageCount: 1,
  showSizePicker: true
});
const queryParams = reactive({
  page_size: 12,
  name: ''
});
const modalType = ref<'add' | 'edit'>('add');
const deviceTemplateList = ref([] as any[]);
const templateId = ref<string>('');
const getData = async () => {
  startLoading();
  const res = await deviceTemplate({ page: pagination.page as number, ...queryParams });
  if (!res.error) {
    deviceTemplateList.value = res.data.list;
    // eslint-disable-next-line require-atomic-updates
    pagination.pageCount = Math.ceil(res.data.total / 12);
  }
  endLoading();
};

const handleQuery = async () => {
  deviceTemplateList.value = [];
  pagination.page = 1;
  await getData();
};

getData();

function handleAddTemplate() {
  modalType.value = 'add';
  templateId.value = '';
  openModal();
}

const handleEdit = async (id: string) => {
  modalType.value = 'edit';
  templateId.value = id;
  openModal();
};

const handleRemove = async (id: string) => {
  const { error } = await deleteDeviceTemplate(id);
  if (!error) {
    window.$message?.info('已删除当前模板');
    await getData();
  }
};
</script>

<template>
  <div class="h-full w-full">
    <NCard>
      <NFlex class="h-full p-4" justify="justify-between">
        <div class="flex-1-hidden">
          <div class="mb-4 flex items-center justify-between">
            <!-- 新建按钮 -->
            <div>
              <NButton @click="handleAddTemplate">添加设备功能模板</NButton>
            </div>
            <!-- 搜索部分 -->
            <div class="flex items-center gap-2">
              <NInput v-model:value="queryParams.name" clearable placeholder="请输入模板名称22" />
              <NButton type="primary" @click="handleQuery">搜索</NButton>
            </div>
          </div>

          <n-spin size="small" :show="loading">
            <NGrid x-gap="24" y-gap="16" :cols="24">
              <NGridItem v-for="item in deviceTemplateList" :key="item.id" :span="6" @click="handleEdit(item.id)">
                <NCard hoverable>
                  <div class="flex-col justify-between">
                    <div class="title text-16px font-600">
                      {{ item.name }}
                    </div>
                    <div class="description mt-2 text-14px">
                      {{ item.description || '--' }}
                    </div>
                  </div>
                  <template v-for="tag in (item.label || '').split(',')" :key="tag">
                    <div style="display: inline-block; margin: 0px 8px 8px 0px">
                      <NTag v-if="tag" class="gap-16px" size="small">{{ tag }}</NTag>
                    </div>
                  </template>

                  <div class="mt-4 flex justify-end gap-2">
                    <NButton strong secondary circle @click.stop="handleRemove(item.id)">
                      <template #icon>
                        <Delete20Regular class="text-24px text-primary" />
                      </template>
                    </NButton>
                  </div>
                </NCard>
              </NGridItem>
            </NGrid>
          </n-spin>
          <div class="pagination-box">
            <NPagination
              v-model:page="pagination.page"
              :page-count="pagination.pageCount"
              @update:page="
                page => {
                  pagination.page = page;
                  getData();
                }
              "
            />
          </div>
        </div>

        <TemplateModal
          v-model:visible="visible"
          :type="modalType"
          :template-id="templateId"
          :get-table-data="getData"
        />
      </NFlex>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.pagination-box {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.description {
  height: 40px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.title {
  height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
