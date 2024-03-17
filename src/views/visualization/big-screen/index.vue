<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
// import {useRouter} from 'vue-router';
import { NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NModal, useMessage } from 'naive-ui';
import type { LastLevelRouteKey } from '@elegant-router/types'; // 假设您已经定义好了这些API
import { DelBoard, PostBoard, PutBoard, getBoardList } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';

const { routerPushByKey } = useRouterPush();
const message = useMessage();
const nameSearch = ref('');
const currentPage = ref(1);
const pageSize = ref(12); // 或根据你的实际需求来设置
const total = ref(0);
const boards = ref<Panel.Board[]>([]);
const showModal = ref<boolean>(false);
const isEditMode = ref(false);
// 初始化表单数据
const formData = reactive({
  id: '',
  name: '',
  home_flag: 'N',
  description: ''
});

// 设置表单数据
const setFormData = data => {
  Object.assign(formData, data);
};

// 清除表单数据
const clearFormData = () => {
  setFormData({ id: '', name: '', home_flag: 'N', description: '' });
  isEditMode.value = false;
};

const setupData = v => {
  boards.value = v;
};
// 获取大屏列表
const fetchBoards = async () => {
  const { data } = await getBoardList({ page: currentPage.value, page_size: pageSize.value, name: nameSearch.value });
  if (data && data.list) {
    setupData(data.list as Panel.Board[]);
    total.value = data.total;
  }
};

// 提交表单
const submitForm = async () => {
  if (!formData.name) {
    message.error('大屏名称不能为空');
    return;
  }

  if (isEditMode.value) {
    await PutBoard(formData); // 编辑大屏
  } else {
    await PostBoard(formData); // 新建大屏
  }

  message.success(isEditMode.value ? '大屏更新成功' : '大屏创建成功');
  showModal.value = false;
  clearFormData();
  await fetchBoards();
};

const editBoard = board => {
  setFormData({ ...board });
  isEditMode.value = true;
  showModal.value = true;
};

// 删除大屏
const deleteBoard = async (id: string) => {
  await DelBoard(id); // 假设DelBoard接收大屏的id
  message.success('大屏删除成功');
  await fetchBoards(); // 刷新大屏列表
};

// 页面跳转
const goRouter = (name: LastLevelRouteKey, id: string) => {
  routerPushByKey(name, { query: { id } });
};

onMounted(fetchBoards);
</script>

<template>
  <div class="h-full w-full">
    <NFlex class="h-full bg-#fff p-4" justify="justify-between">
      <div class="flex-1-hidden">
        <div class="mb-4 flex items-center justify-between">
          <!-- 新建按钮 -->
          <div>
            <NButton @click="showModal = true">新建大屏</NButton>
          </div>
          <!-- 搜索部分 -->
          <div class="flex items-center gap-2">
            <NInput
              v-model:value="nameSearch"
              clearable
              placeholder="按名称搜索"
              @clear="
                () => {
                  nameSearch = '';
                  fetchBoards();
                }
              "
            />

            <NButton type="primary" @click="fetchBoards">搜索</NButton>
          </div>
        </div>
        <!-- 大屏列表 -->
        <NGrid x-gap="24" y-gap="16" :cols="24">
          <NGridItem
            v-for="board in boards"
            :key="board.id"
            :span="6"
            @click="goRouter('visualization_panel-details', board.id as string)"
          >
            <NCard hoverable>
              <div class="mb-8px text-16px font-600">{{ board.name }}</div>
              <!-- 使用NTooltip组件 -->
              <NTooltip trigger="hover" placement="top-start" :style="{ maxWidth: '200px' }">
                <template #trigger>
                  <div class="description">{{ board.description }}</div>
                </template>
                {{ board.description }}
              </NTooltip>
              <div class="mt-4 flex justify-end gap-2">
                <NButton strong circle secondary @click.stop="editBoard(board)">
                  <template #icon>
                    <icon-material-symbols:contract-edit-outline class="text-24px text-blue" />
                  </template>
                </NButton>
                <NButton strong secondary circle @click.stop="deleteBoard(board.id as string)">
                  <template #icon>
                    <icon-material-symbols:delete-outline class="text-24px text-red" />
                  </template>
                </NButton>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>
      </div>
      <!-- 大屏列表后面添加分页器 -->
      <div class="mt-4 h-60px w-full">
        <NFlex justify="end">
          <NPagination
            v-model:page="currentPage"
            :page-size="pageSize"
            :item-count="total"
            @update:page="fetchBoards"
          />
        </NFlex>
      </div>
    </NFlex>
    <!-- 新建和编辑大屏的模态框 -->
    <NModal v-model:show="showModal" :title="isEditMode ? '编辑大屏' : '新建大屏'" class="w-600px">
      <NCard bordered>
        <NForm :model="formData" class="flex-1">
          <NFormItem label="大屏名称" path="name">
            <NInput v-model:value="formData.name" placeholder="请输入大屏名称" />
          </NFormItem>
          <NFormItem label="描述">
            <NInput v-model:value="formData.description" type="textarea" placeholder="请输入描述" />
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton
              type="default"
              @click="
                showModal = false;
                clearFormData();
              "
            >
              取消
            </NButton>
            <NButton type="primary" @click="submitForm">保存</NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>

<style scoped>
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block; /* 确保这是一个块级元素 */
  max-width: 100%;
  color: #666;
  margin-bottom: 12px;
}
</style>
