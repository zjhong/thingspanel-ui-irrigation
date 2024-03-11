<script setup lang="ts">

import {DataTableColumns, NPagination} from "naive-ui";
import {Ref, ref, onMounted} from "vue";
import {deviceTemplate, deviceTemplateDetail} from "@/service/api/device";
const showPopover=ref(false)
const props = defineProps({
  device_template_id: {
    type: String,
    default(){
      return ''
    },
  },
})
const templateDetail=ref({})
const columns :Ref<DataTableColumns<ServiceManagement.Service>> =ref([
  {
    key: 'name',
    title: '名称',
    align: 'center',
  },
  {
    key: 'author',
    title: '作者',
    align: 'center',
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
  },
])
const plugList=ref([])
const plugQuery=ref({
  page:1,
  page_size:10,
  name:''
})
const plugTotal=ref(0)
const getTableData=async ()=>{
  const res=await deviceTemplate(plugQuery.value)
  plugList.value=res.data.list
  plugTotal.value=res.data.total
}
const searchPlug=()=>{
  plugQuery.value.page=1
  getTableData()
}
const getTemplateDetail=async ()=>{
  const res= await deviceTemplateDetail({id:props.device_template_id})
  templateDetail.value=res.data
}
const openPopover=()=>{
  showPopover.value=true
  plugQuery.value.name='私有'
  getTableData()
}
// watch(
//     () => props.device_template_id,
//     (newValue) => {
//       if(newValue){
//         getTemplateDetail()
//       }
//     }
// )
onMounted(async ()=>{
  await getTemplateDetail()
})
</script>

<template>
  <div class="attribute-box">
    <div class="flex" style="align-items: center">
      <div style="margin-right: 10px">
        绑定设备模板
      </div>
      <n-popover :show="showPopover" placement="bottom-start" trigger="manual" @clickoutside="showPopover=false">
        <template #trigger>
          <NInput v-model:value="props.device_template_id" @focus="openPopover" @blur="showPopover=false" style="width: 300px;margin: 0 15px"/>
        </template>
        <div style="width: 500px">
          <NInput v-model:value="plugQuery.name" @focus="showPopover=true" @input="searchPlug" />
          <NDataTable
              :columns="columns"
              :data="plugList"
              size="small"
              class="flex-1-hidden"
              style="margin: 10px 0"
          />
          <div class="pagination-box">
            <!-- Data table to display device groups -->
            <!-- Pagination component -->
            <NPagination v-model:page="plugQuery.page" :page-size="plugQuery.page_size" :item-count="plugTotal" @update:page="getTableData"  />
          </div>
        </div>
      </n-popover>
      <div class="to-create">
        没有找到？去创建
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.to-create{
  color: #999999;
}
.to-create:hover{
  cursor:pointer;
  text-decoration: underline;
  color: #646cff;
}
.pagination-box{
  display: flex;
  justify-content: flex-end;
}
</style>
