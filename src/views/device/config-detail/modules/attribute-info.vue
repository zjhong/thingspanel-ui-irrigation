<script setup lang="ts">

import {DataTableColumns, NButton, NFlex, NPagination, useMessage} from "naive-ui";
import {Ref, ref, onMounted, h,watch} from "vue";
import {deviceConfigEdit, deviceTemplate, deviceTemplateDetail} from "@/service/api/device";
const message = useMessage();
const emit = defineEmits();

const showPopover=ref(false)
const props = defineProps({
  configInfo: {
      type: Object,
      default(){
          return null
      },
  },
})
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
      width:'150px',
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
      width:'130px',
    render (row) {
        return h(NFlex,{
            justify:'center'
        }, [
            h(NButton,{
                    ghost:true,
                    type:"primary",
                    tertiary: true,
                    size: 'small',
                    onClick: () => choseTemp(row)
                }, { default: () => '选择' }
            ),
            h(NButton,{
                ghost:true,
                type:"info",
                tertiary: true,
                size: 'small',
                onClick: () => openTemp(row)
            }, { default: () => '查看' }),
        ])
    }
  },
])
const choseTemp= async (row)=>{
    const postData=props.configInfo
    postData.device_template_id=row.id
    const  res=await deviceConfigEdit(postData)
    if(!res.error){
        message.success('修改成功');
        templateDetail.value=row
        plugQuery.value.name=row.name
        searchPlug()
        emit('upDateConfig');
    }
}
const openTemp=(row)=>{

}
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
const templateDetail=ref({})
const getTemplateDetail=async ()=>{
    if(props.configInfo.device_template_id){
        const res= await deviceTemplateDetail({id:props.configInfo.device_template_id})
        templateDetail.value=res.data
    }
}
const openPopover=()=>{
  showPopover.value=true
  plugQuery.value.name=templateDetail.value.name
  getTableData()
}
// watch(
//     () => props.configInfo,
//     (newValue) => {
//       if(newValue){
//           message.success('111');
//         // getTemplateDetail()
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
          <NInput v-model:value="templateDetail.name" @focus="openPopover" @blur="showPopover=false" style="width: 300px;margin: 0 15px" />
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
.attribute-box{
  padding: 50px;
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
}

</style>
