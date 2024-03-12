<script setup lang="ts">
import {onMounted, Ref, ref} from 'vue'
import {DataTableColumns, FormInst, NButton, NPagination, useMessage} from "naive-ui";
import {deviceConfigBatch, deviceList} from "@/service/api/device";
import moment from "moment/moment";
const message = useMessage();

const props = defineProps({
    device_config_id: {
        type: String,
        default(){
          return ''
        },
    },
})
const visible = ref(false)
const associatedFormRef = ref<HTMLElement & FormInst>();
const associatedForm = ref(defaultAssociatedForm());

function defaultAssociatedForm() {
  return {
    device_ids: null,
    device_config_id:'',
  };
}
const associatedFormRules = ref({
  // device_ids: {
  //   required: true,
  //   message: '请选择设备',
  //   trigger: 'change'
  // },
})

const addDevice= () =>{
  getDeviceOptions()
  visible.value=true
}
const modalClose= ()=>{

}
const handleSubmit=async ()=>{
  await associatedFormRef?.value?.validate();
  associatedForm.value.device_config_id=props.device_config_id
  const res=await  deviceConfigBatch(associatedForm.value)
  if (!res.error) {
    message.success('新增成功');
    handleClose()
  }
}
const handleClose=()=>{
  associatedFormRef.value?.restoreValidation();
  associatedForm.value=defaultAssociatedForm()
  visible.value=false
  queryData.value.page=1
  getDeviceList()
}
const handleScroll=(e: Event)=>{
  const currentTarget = e.currentTarget as HTMLElement
  if (
      currentTarget.scrollTop + currentTarget.offsetHeight >=
      currentTarget.scrollHeight
  ) {
    if(deviceOptions.value.length<=queryDevice.value.total){
      queryDevice.value.page+=1
      getDeviceOptions()
    }
  }
}

const deviceOptions=ref([] as any [])
const queryDevice=ref({
  page:1,
  page_size:20,
  total:0,
})
const getDeviceOptions= async ()=>{
  const res=await  deviceList(queryDevice.value)
  deviceOptions.value=deviceOptions.value.concat(res.data.list)
  queryDevice.value.total=res.data.total
}
const columnsData :Ref<DataTableColumns<ServiceManagement.Service>> =ref([
  {
    key: 'name',
    title: '设备名称',
    align: 'center',
  },
  {
    key: 'device_number',
    title: '设备编码',
    align: 'center',
  },
  {
    key: 'activate_flag',
    title: '在线状态',
    align: 'center',
  },
  {
    key: 'ts',
    title: '推送时间',
    align: 'center',
    render: row => {
      if(row.ts){
        return moment(row.ts).format('YYYY-MM-DD hh:mm:ss');
      }else{
        return ''
      }
    }
  },
])
const queryData=ref({
  device_config_id:'',
  page:1,
  page_size:10,
})
const configDevice=ref([])
const configDeviceTotal=ref(0)
const getDeviceList=async ()=>{
  queryData.value.device_config_id=props.device_config_id
  const res= await deviceList(queryData.value)
  configDevice.value=res.data.list || []
  configDeviceTotal.value=res.data.total
}
// const device_config_id=ref('7d7fd9f7-9ce8-cf8a-5bfd-27ef3c4eb824')
onMounted(async ()=>{
  await getDeviceList()
})
</script>

<template>
  <div class="associated-box">
    <NButton type="primary" @click="addDevice()" >+添加设备</NButton>
    <NDataTable
        :columns="columnsData"
        :data="configDevice"
        size="small"
        :row-key="item => item.id"
        class="flex-1-hidden"
        style="margin: 10px ;height: 50%"
    />
    <div class="pagination-box">
      <!-- Data table to display device groups -->
      <!-- Pagination component -->
      <NPagination v-model:page="queryData.page" :page-size="queryData.page_size" :item-count="configDeviceTotal" @update:page="getDeviceList"  />
    </div>
    <NModal v-model:show="visible" :mask-closable="false" title="添加设备" class="w-600px"
            preset="card" @after-leave="modalClose">
      <NForm ref="associatedFormRef" :model="associatedForm" :rules="associatedFormRules" label-placement="left" label-width="auto">
        <NFormItem label="选择设备" path="device_ids">
          <NSelect
              v-model:value="associatedForm.device_ids"
              :options="deviceOptions"
              label-field="name"
              value-field="id"
              multiple
              filterable
              @scroll="handleScroll"
          ></NSelect>
        </NFormItem>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <NButton @click="handleClose">取消</NButton>
          <NButton @click="handleSubmit" type="primary">添加</NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.associated-box{
  height: 100%;
}
.pagination-box{
  display: flex;
  justify-content: flex-end;
}
</style>
