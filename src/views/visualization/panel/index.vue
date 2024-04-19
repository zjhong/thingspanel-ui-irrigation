<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
// import {useRouter} from 'vue-router';
import { NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NModal, useMessage } from 'naive-ui';
import type { LastLevelRouteKey } from '@elegant-router/types'; // 假设您已经定义好了这些API
import { DelBoard, PostBoard, PutBoard, getBoardList } from '@/service/api/index';
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
// 获取看板列表
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
    message.error('看板名称不能为空');
    return;
  }

  if (isEditMode.value) {
    await PutBoard(formData); // 编辑看板
  } else {
    await PostBoard(formData); // 新建看板
  }

  showModal.value = false;
  clearFormData();
  await fetchBoards();
};

const editBoard = board => {
  setFormData({ ...board });
  isEditMode.value = true;
  showModal.value = true;
};

// 删除看板
const deleteBoard = async (id: string) => {
  await DelBoard(id); // 假设DelBoard接收看板的id
  await fetchBoards(); // 刷新看板列表
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
            <NButton @click="showModal = true">新建看板</NButton>
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
        <!-- 看板列表 -->
        <NGrid x-gap="24" y-gap="16" :cols="24">
          <NGridItem
            v-for="board in boards"
            :key="board.id"
            :span="6"
            @click="goRouter('visualization_panel-details', board.id as string)"
          >
            <NCard hoverable>
              <div class="flex justify-between">
                <div class="text-16px font-600">
                  {{ board.name }}
                </div>
                <div
                  v-if="board.home_flag === 'Y'"
                  class="mr--4 mt--2 h-24px w-24px border border-red-4 rounded-50 text-center text-12px text-red font-600"
                >
                  首
                </div>
              </div>
              <!-- 使用NTooltip组件 -->
              <NTooltip trigger="hover" placement="top-start" :style="{ maxWidth: '200px' }">
                <template #trigger>
                  <div class="description">{{ board.description }}</div>
                </template>
                {{ board.description }}
              </NTooltip>
              <div class="mt-4 flex justify-end gap-2">
                <NButton circle strong secondary @click.stop="editBoard(board)">
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
      <!-- 看板列表后面添加分页器 -->
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
    <!-- 新建和编辑看板的模态框 -->
    <NModal v-model:show="showModal" :title="isEditMode ? '编辑看板' : '新建看板'" class="w-600px">
      <NCard bordered>
        <NForm :model="formData" class="flex-1">
          <NFormItem label="看板名称" path="name">
            <NInput v-model:value="formData.name" placeholder="请输入看板名称" />
          </NFormItem>
          <NFormItem label="是否首页">
            <NSelect
              v-model:value="formData.home_flag"
              :options="[
                { label: '是', value: 'Y' },
                { label: '否', value: 'N' }
              ]"
            />
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
