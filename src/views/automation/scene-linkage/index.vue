<script lang="tsx" setup>
import { onMounted, ref } from 'vue';
import { NButton, NFlex, NPagination } from 'naive-ui';
import { IosSearch } from '@vicons/ionicons4';
import { CopyOutline as copyIcon, PencilOutline as editIcon, TrashOutline as trashIcon } from '@vicons/ionicons5';
import { router } from '@/router';
import { deviceConfig } from '@/service/api/device';

const showModal = () => {
  router.push({ name: 'automation_linkage-edit' });
};
const queryData = ref({
  page: 1,
  page_size: 12,
  name: ''
});
const deviceConfigList = ref([] as any[]);
const dataTotal = ref(0);
const getData = async () => {
  const res = await deviceConfig(queryData.value);
  if (!res.error) {
    deviceConfigList.value = res.data.list;
    dataTotal.value = res.data.total;
  }
};
const handleQuery = async () => {
  deviceConfigList.value = [];
  await getData();
};
const openDetail = () => {
  // router.push({ name: 'device_config-detail', query: { id: item.id } });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="overflow-hidden">
    <NCard title="场景联动列表">
      <NFlex justify="space-between">
        <NButton type="primary" @click="showModal()">+新增联动规则</NButton>
        <NFlex align="center">
          <NInput
            v-model:value="queryData.name"
            placeholder="请输入场景联动名称"
            class="search-input"
            type="text"
            clearable
          >
            <template #prefix>
              <NIcon>
                <IosSearch />
              </NIcon>
            </template>
          </NInput>
          <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>
        </NFlex>
      </NFlex>
      <div class="config-content h-full flex-col">
        <div v-for="item in 5" :key="item" class="scene-item">
          <div class="item-name">
            <div>
              {{ item }}
            </div>
            <n-switch />
          </div>
          <div class="item-desc">温度大于28度报警</div>
          <div class="item-operate">
            <NButton tertiary circle type="warning" @click="openDetail">
              <template #icon>
                <n-icon>
                  <editIcon />
                </n-icon>
              </template>
            </NButton>
            <NButton circle tertiary type="info">
              <template #icon>
                <n-icon>
                  <copyIcon />
                </n-icon>
              </template>
            </NButton>
            <NButton circle tertiary type="error">
              <template #icon>
                <n-icon>
                  <trashIcon />
                </n-icon>
              </template>
            </NButton>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!-- Data table to display device groups -->
        <!-- Pagination component -->
        <NPagination
          v-model:page="queryData.page"
          :page-size="queryData.page_size"
          :item-count="dataTotal"
          @update:page="getData"
        />
      </div>
      <!--      <ConfigModal-->
      <!--        :type="modalType"-->
      <!--        :modalVisible="modalVisible"-->
      <!--        @modalClose="modalClose"-->
      <!--        @submitted="getData"-->
      <!--      />-->
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.config-content {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  .scene-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 18px;
    flex: 0 0 26%;
    margin-right: calc(20% / 2);
    margin-bottom: 30px;

    .item-name {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
    }

    .item-desc {
      margin: 15px 0;
    }

    .item-operate {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  .scene-item:hover {
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  /* 去除每行尾多余的边距 */
  .scene-item:nth-child(3n) {
    margin-right: 0;
  }
}
.pagination-box {
  display: flex;
  justify-content: flex-end;
}
.search-input {
  width: 180px;
}
</style>
