<script setup lang="ts">
import {ref} from "vue";
import {NButton} from "naive-ui";

const typeOptions=ref([])
const extendForm=ref({
  protocol_type:null,
  voucher_type:null,
})
const handleSubmit=()=>{

}
</script>

<template>
  <div class="connection-box">
    <div>
      通过协议接入
    </div>
    <NForm ref="extendFormRef" :model="extendForm" :rules="extendFormRules" label-placement="left" label-width="auto">
      <NFormItem label="选择协议/服务" path="protocol_type">
        <NSelect  v-model:value="extendForm.protocol_type" :options="typeOptions" placeholder="请选择选择协议/服务" style="width: 200px;"></NSelect>
      </NFormItem>
      <NFormItem label="认证类型" path="voucher_type">
        <NSelect  v-model:value="extendForm.voucher_type" :options="typeOptions" placeholder="请选择认证类型" style="width: 200px;"></NSelect>
      </NFormItem>
    </NForm>
    <div>
      <NButton @click="handleSubmit" type="primary">保存</NButton>
    </div>
  </div>
</template>

<style scoped>

</style>
