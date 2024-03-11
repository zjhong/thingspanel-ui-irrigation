<script lang="tsx" setup>
import {onMounted,ref} from 'vue'
import {IosSearch} from "@vicons/ionicons4";
import {NButton, NFlex, NPagination} from "naive-ui";
import {debounce} from "lodash";
import ConfigModal  from './modules/config-modal.vue';
import {deviceConfig} from "@/service/api/device";

const searchValue=ref('')
const isRequestPending = ref(false);
const modalVisible = ref(false);
const modalType = ref('add');

const showModal=(type)=>{
  modalVisible.value=true
  modalType.value=type
}
// 监听输入变化并调用 debounced 函数
const handleInput = () => {
  debouncedSearch();
};
// 使用 lodash 的 debounce 函数来延迟搜索请求的发送
const debouncedSearch = debounce(async () => {
  // if (isRequestPending.value) {
  //   return; // 如果当前有请求正在进行，则不执行新的请求
  // }
  //
  // isRequestPending.value = true;
  // loading.value = true;
  // const res = await deviceConfig({
  //   page: currentPage.value,
  //   page_size: 10,
  //   name: searchValue.value.trim() || undefined
  // });
  // data.value = res.data.list;
  // totalPages.value = Math.ceil(res.data.total / 10);
  //
  // loading.value = false;
  //
  // // eslint-disable-next-line require-atomic-updates
  // isRequestPending.value = false;
}, 500); // 设置延迟为 500 毫秒

const modalClose=()=>{
    modalVisible.value=false
}
const queryData=ref({
  page:1,
  page_size:12,
})
const deviceConfigList=ref([] as any [])
const dataTotal=ref(0)
const getData=async ()=>{
  const res= await deviceConfig(queryData.value)
  if(!res.error){
    deviceConfigList.value=res.data.list
    dataTotal.value=res.data.total
  }
}
onMounted(()=>{
    getData()
})
</script>

<template>
  <div class="overflow-hidden">
    <NCard>
      <NFlex justify="space-between">
        <!-- Button to trigger modal for creating a new device group -->
        <NButton type="primary" @click="showModal('add')">+创建设备配置</NButton>
        <!-- Input for search functionality -->
        <NInput
          v-model:value="searchValue"
          :disabled="isRequestPending"
          autosize
          placeholder="请输入配置名称"
          style="min-width: 180px"
          type="text"
          @input="handleInput"
        >
          <template #prefix>
            <NIcon>
              <IosSearch />
            </NIcon>
          </template>
        </NInput>
      </NFlex>
      <div  class="flex-col h-full config-content" >
        <div v-for="(item,itemIndex) in deviceConfigList" :key="itemIndex" class="config-item">
          <img class="config-item-img" src="https://img0.baidu.com/it/u=1010119301,1861323772&fm=253&fmt=auto&app=138&f=JPEG?w=535&h=500" alt="">
          <div class="config-item-title">
           {{item.name}}
          </div>
          <div class="config-item-statistics">
            <div>
              2个设备
            </div>
            <div>
              直连设备
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!-- Data table to display device groups -->
        <!-- Pagination component -->
        <NPagination v-model:page="queryData.page" :item-count="dataTotal" @update:page="getData"  />
      </div>
      <ConfigModal
        :type="modalType"
        :modalVisible="modalVisible"
        @modalClose="modalClose"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.config-content{
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  .config-item{
    //height: 120px;
    //width: 25%;
    border: solid 1px #000000;
    //margin: 0 10px;
    padding: 12px;
    flex: 0 0 23%;
    margin-right: calc(8% / 3);
    margin-bottom: 20px;
    .config-item-img{
      width: 80px;
      height: 60px;
    }
    .config-item-title{
      margin: 10px 0;
      font-size: 12px;
      font-weight: bold;
    }
    .config-item-statistics{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
  }
  /* 去除每行尾多余的边距 */
  .config-item:nth-child(4n) {
    margin-right: 0;
  }
}
.pagination-box{
  display: flex;
  justify-content: flex-end;
}
</style>
