<script setup lang="ts">
import {Ref, ref} from 'vue'
import {DataTableColumns, FormInst, NButton, NPagination} from "naive-ui";
import {deviceList} from "@/service/api/device";
const visible = ref(false)
const associatedFormRef = ref<HTMLElement & FormInst>();
const associatedForm = ref(defaultAssociatedForm());

function defaultAssociatedForm() {
  return {
    device_ids: null,
  };
}
const associatedFormRules = ref({
  name: {
    required: true,
    message: '请输入设备配置名称',
    trigger: 'blur'
  },
  device_type: {
    required: true,
    message: '请选择设备接入类型',
    trigger: 'change'
  },
  device_conn_type: {
    required: true,
    message: '请选择设备连接方式',
    trigger: 'change'
  }
})
const associatedList=ref([])
const associatedTotal=ref(0)
const associatedQuery=ref({
  page:1,
  page_size:10,
})
const getTableData=()=>{

}
const deviceOptions=ref([] as any [])
const addDevice= () =>{
  getDeviceList()
  visible.value=true
}
const modalClose= ()=>{

}
const handleSubmit=()=>{

}
const handleClose=()=>{
  associatedFormRef.value?.restoreValidation();
  associatedForm.value=defaultAssociatedForm()
  visible.value=false

}
const handleScroll=(e: Event)=>{
  const currentTarget = e.currentTarget as HTMLElement
  if (
      currentTarget.scrollTop + currentTarget.offsetHeight >=
      currentTarget.scrollHeight
  ) {
    if(deviceOptions.value.length<=queryDevice.value.total){
      queryDevice.value.page+=1
      getDeviceList()
    }
  }
}
const queryDevice=ref({
  page:1,
  page_size:20,
  total:0,
})
const getDeviceList= async ()=>{
  const res=await  deviceList(queryDevice.value)
  deviceOptions.value=res.data.list
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
    key: 'userName',
    title: '推送时间',
    align: 'center',
  },
])
</script>

<template>
  <div >
    <NButton type="primary" @click="addDevice()" >+添加设备</NButton>
    <NDataTable
        :columns="columnsData"
        :data="associatedList"
        size="small"
        :row-key="item => item.id"
        class="flex-1-hidden"
        style="margin: 10px 0"
    />
    <div class="pagination-box">
      <!-- Data table to display device groups -->
      <!-- Pagination component -->
      <NPagination v-model:page="associatedQuery.page" :item-count="associatedTotal" @update:page="getTableData"  />
    </div>
    <NModal v-model:show="visible" :mask-closable="false" title="添加设备" class="w-400px"
            preset="card" @after-leave="modalClose">
      <NForm ref="associatedFormRef" :model="associatedForm" :rules="associatedFormRules" label-placement="left" label-width="auto">
        <NFormItem label="选择设备" path="device_ids">
          <NSelect
              v-model:value="associatedForm.device_ids"
              :options="deviceOptions"
              label-field="name"
              value-field="id"
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
.pagination-box{
  display: flex;
  justify-content: flex-end;
}
</style>
