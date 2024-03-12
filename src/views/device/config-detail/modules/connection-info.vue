<script setup lang="ts">
import {onMounted, ref} from "vue";
import {NButton, useMessage} from "naive-ui";
import {dictQuery} from "@/service/api/setting";
import {deviceConfigEdit} from "@/service/api/device";
const message = useMessage();
const emit = defineEmits();

const typeOptions=ref([])
const props = defineProps({
  configInfo: {
    type: Object,
    default(){
      return null
    },
  },
})
const extendForm=ref({
  protocol_type:null,
  voucher_type:null,
} as any)
const extendFormRules=ref({})
const handleSubmit= async ()=>{
  const postData=props.configInfo
  postData.protocol_type=extendForm.value.protocol_type
  postData.voucher_type=extendForm.value.voucher_type
  const  res=await deviceConfigEdit(postData)
  if(!res.error){
    message.success('修改成功');
    emit('upDateConfig');
  }
}
const getDict=async (dictCode)=>{
  const queryData={
    dict_code:dictCode,
  }
  const res=  await dictQuery(queryData)
  typeOptions.value=res.data || []
}
onMounted(()=>{
  if(props.configInfo.device_type==='1'){
    getDict('DRIECT_ATTACHED_PROTOCOL')
  }else if(props.configInfo.device_type==='2') {
    getDict('GATEWAY_PROTOCOL')
  }
  extendForm.value =props.configInfo
})
</script>

<template>
  <div class="connection-box">
    <div class="connection-title">
      通过协议接入
    </div>
    <NForm ref="extendFormRef" :model="extendForm" :rules="extendFormRules" label-placement="left" label-width="auto" style="width: 300px">
      <NFormItem label="选择协议/服务" path="protocol_type">
        <NSelect  v-model:value="extendForm.protocol_type" :options="typeOptions" placeholder="请选择选择协议/服务"
                  label-field="translation" value-field="dict_value"
                  :disabled="props.configInfo.device_type==='3'">
        </NSelect>
      </NFormItem>
      <NFormItem label="认证类型" path="voucher_type">
        <NSelect  v-model:value="extendForm.voucher_type" :options="typeOptions" placeholder="请选择认证类型"
                  label-field="translation" value-field="dict_value"
                  disabled></NSelect>
      </NFormItem>
      <div style="display: flex; justify-content: flex-end; gap: 8px">
        <NButton @click="handleSubmit" type="primary">保存</NButton>
      </div>
    </NForm>
  </div>
</template>

<style scoped lang="scss">
.connection-box{
  padding: 50px;
  .connection-title{
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}

</style>
