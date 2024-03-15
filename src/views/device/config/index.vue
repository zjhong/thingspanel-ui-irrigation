<script lang="tsx" setup>
import { onMounted, ref } from 'vue';
import { NButton, NFlex, NPagination } from 'naive-ui';
import { IosSearch } from '@vicons/ionicons4';
import { router } from '@/router';
import { deviceConfig } from '@/service/api/device';

const showModal = () => {
  router.push({ name: 'device_config-edit' });
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
const openDetail = (item: any) => {
  router.push({ name: 'device_config-detail', query: { id: item.id } });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="overflow-hidden">
    <NCard>
      <NFlex justify="space-between">
        <NButton type="primary" @click="showModal()">+创建设备配置</NButton>
        <NFlex align="center">
          <NInput
            v-model:value="queryData.name"
            placeholder="请输入配置名称"
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
        <div
          v-for="(item, itemIndex) in deviceConfigList"
          :key="itemIndex"
          class="config-item"
          @click="openDetail(item)"
        >
          <img
            class="config-item-img"
            src="https://img0.baidu.com/it/u=1010119301,1861323772&fm=253&fmt=auto&app=138&f=JPEG?w=535&h=500"
            alt=""
          />
          <div class="config-item-title">
            {{ item.name }}
          </div>
          <div class="config-item-statistics">
            <div>{{ item.device_count }}个设备</div>
            <div>
              <template v-if="item.device_type === '1'">直连设备</template>
              <template v-if="item.device_type === '2'">网关</template>
              <template v-if="item.device_type === '3'">网关子设备</template>
            </div>
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
  .config-item {
    //height: 120px;
    //width: 25%;
    //border: solid 1px #000000;
    //margin: 0 10px;
    padding: 12px;
    flex: 0 0 23%;
    margin-right: calc(8% / 3);
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: 12px;
    .config-item-img {
      width: 80px;
      height: 60px;
    }
    .config-item-title {
      margin: 10px 0;
      font-size: 12px;
      font-weight: bold;
    }
    .config-item-statistics {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
  }
  .config-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  /* 去除每行尾多余的边距 */
  .config-item:nth-child(4n) {
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
