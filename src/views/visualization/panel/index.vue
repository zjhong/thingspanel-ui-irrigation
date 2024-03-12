<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NCard, NForm, NFormItem, NGrid, NGridItem, NInput, NModal, useMessage } from 'naive-ui';
import { DelBoard, PostBoard, PutBoard, getBoardList } from '@/service/api'; // 假设您已经定义好了这些API

const router = useRouter();
const message = useMessage();
const nameSearch = ref('');

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
  const { data } = await getBoardList({ page: 1, page_size: 10, name: nameSearch.value });
  if (data && data.list) {
    setupData(data.list as Panel.Board[]);
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

  message.success(isEditMode.value ? '看板更新成功' : '看板创建成功');
  showModal.value = false;
  clearFormData();
  fetchBoards();
};

const editBoard = board => {
  setFormData({ ...board });
  isEditMode.value = true;
  showModal.value = true;
};

// 删除看板
const deleteBoard = async (id: string) => {
  console.log(id, 'dsadsad');
  await DelBoard(id); // 假设DelBoard接收看板的id
  message.success('看板删除成功');
  fetchBoards(); // 刷新看板列表
};

// 页面跳转
const goRouter = (name: string, params: any) => {
  router.push({ name, params });
};

onMounted(fetchBoards);
</script>

<template>
  <div class="h-full w-full">
    <div class="mb-4 flex items-center justify-between">
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
      <!-- 新建按钮 -->
      <div>
        <NButton @click="showModal = true">新建看板</NButton>
      </div>
    </div>
    <!-- 看板列表 -->
    <NGrid x-gap="24" y-gap="16" :cols="12">
      c
      <NGridItem v-for="board in boards" :key="board.id" :span="4" @click="goRouter('viewBoard', { id: board.id })">
        <NCard @click.stop="goRouter('visualization_panel-details', board)">
          <div>{{ board.name }}</div>
          <div>{{ board.description }}</div>
          <div class="flex justify-end gap-2">
            <NButton @click.stop="editBoard(board)">编辑</NButton>
            <NButton @click.stop="deleteBoard(board.id as string)">删除</NButton>
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
    <!-- 新建看板的模态框 -->
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
.cursor-pointer {
  cursor: pointer;
}
</style>
