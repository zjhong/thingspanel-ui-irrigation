<script setup lang="ts">
import {onMounted, Ref, ref} from 'vue'
import {DataTableColumns, FormInst, NButton, useMessage} from "naive-ui";
import {deviceConfigEdit} from "@/service/api/device";
const visible = ref(false)
const extendFormRef = ref<HTMLElement & FormInst>();
const extendForm = ref(defaultExtendForm());
const message = useMessage();
const emit = defineEmits();
const props = defineProps({
  configInfo: {
    type: Object,
    default(){
      return null
    },
  },
})

function defaultExtendForm() {
  return {
    name: null,
    type:null,
    default_value:null,
    desc:null,
  };
}
const extendFormRules = ref({
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  },
  type: {
    required: true,
    message: '请选择类型',
    trigger: 'change'
  },
})
const extendInfoList=ref([] as any [])
const typeOptions=ref([
  {
    label:'String',
    value:'String'
  },
  {
    label:'Number',
    value:'Number'
  },
  {
    label:'Boolean',
    value:'Boolean'
  }
])
const addDevice= () =>{
  visible.value=true
}
const modalClose= ()=>{

}
const handleSubmit=async ()=>{
  await extendFormRef?.value?.validate();
  extendInfoList.value.push(extendForm.value)
  const postData=props.configInfo
  postData.additional_info=JSON.stringify(extendInfoList.value)
  const  res=await deviceConfigEdit(postData)
  if(!res.error){
    message.success('修改成功');
    emit('upDateConfig');
  }
  handleClose()
}
const handleClose=()=>{
  extendFormRef.value?.restoreValidation();
  extendForm.value=defaultExtendForm()
  visible.value=false
}
const columns :Ref<DataTableColumns<ServiceManagement.Service>> =ref([
  {
    key: 'name',
    title: '名称',
    align: 'center',
  },
  {
    key: 'type',
    title: '类型',
    align: 'center',
  },
  {
    key: 'default_value',
    title: '默认值',
    align: 'center',
  },
  {
    key: 'desc',
    title: '描述',
    align: 'center',
  },
  {
    key: 'enable',
    title: '启用',
    align: 'center',
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
  },
])

onMounted(()=>{
  if(props.configInfo.additional_info && props.configInfo.additional_info==="{}"){
    extendInfoList.value=[]
  }else{
    extendInfoList.value=JSON.parse(props.configInfo.additional_info)
  }
})
</script>

<template>
  <div class="extend-box">
    <NButton type="primary" @click="addDevice()" >+添加扩展信息</NButton>
    <NDataTable
        :columns="columns"
        :data="extendInfoList"
        size="small"
        class="flex-1-hidden"
        style="margin: 10px 0"
    />
<!--    <div class="pagination-box">-->
<!--      &lt;!&ndash; Data table to display device groups &ndash;&gt;-->
<!--      &lt;!&ndash; Pagination component &ndash;&gt;-->
<!--      <NPagination v-model:page="associatedQuery.page" :item-count="associatedTotal" @update:page="getTableData"  />-->
<!--    </div>-->
    <NModal v-model:show="visible" :mask-closable="false" title="添加扩展信息" class="w-400px"
            preset="card" @after-leave="modalClose">
      <NForm ref="extendFormRef" :model="extendForm" :rules="extendFormRules" label-placement="left" label-width="auto">
        <NFormItem label="名称" path="name">
          <NInput v-model:value="extendForm.name" placeholder="请输入设备名称"/>
        </NFormItem>
        <NFormItem label="类型" path="type">
          <NSelect  v-model:value="extendForm.type" :options="typeOptions" placeholder="请选择类型"></NSelect>
        </NFormItem>
        <NFormItem label="默认值" path="default_value">
          <NInput v-model:value="extendForm.default_value" placeholder="请输入默认值"/>
        </NFormItem>
        <NFormItem label="描述" path="device_ids">
          <NInput v-model:value="extendForm.desc" placeholder="请输入描述" type="textarea"/>
        </NFormItem>
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <NButton @click="handleClose">取消</NButton>
          <NButton @click="handleSubmit" type="primary">确定</NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.extend-box{
  .pagination-box{
    display: flex;
    justify-content: flex-end;
  }
}

</style>
