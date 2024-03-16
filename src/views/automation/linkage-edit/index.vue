<script setup lang="ts">
import { ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { NButton } from 'naive-ui';
import EditAction from '@/views/automation/linkage-edit/modules/edit-action.vue';
import EditPremise from '@/views/automation/linkage-edit/modules/edit-premise.vue';

const configFormRules = ref({
  name: {
    required: true,
    message: '请输入设备配置名称',
    trigger: 'blur'
  }
});
const configFormRef = ref<HTMLElement & FormInst>();
const configForm = ref(defaultConfigForm());

function defaultConfigForm() {
  return {
    name: null,
    description: null
  };
}
</script>

<template>
  <div class="linkage-edit">
    <NForm
      ref="configFormRef"
      :model="configForm"
      :rules="configFormRules"
      label-placement="left"
      label-width="150"
      size="small"
    >
      <NFlex>
        <NFormItem label="场景联动名称" path="name" class="w-150">
          <NInput v-model:value="configForm.name" placeholder="请输入场景联动名称" />
        </NFormItem>
        <NFormItem label="描述" path="description" class="w-150">
          <NInput v-model:value="configForm.description" type="textarea" placeholder="请输入描述" rows="1" />
        </NFormItem>
      </NFlex>
      <NFormItem label="如果:" class="w-100%">
        <EditPremise />
      </NFormItem>
      <NFormItem label=" ">
        <n-divider dashed class="divider-class" />
      </NFormItem>
      <NFormItem label="那么:" class="w-100%">
        <EditAction />
      </NFormItem>
    </NForm>
    <n-divider class="divider-class" />
    <NFlex justify="center" class="mt-20">
      <NButton type="primary">保存</NButton>
    </NFlex>
  </div>
</template>

<style scoped>
.divider-class {
  margin: 0;
}
</style>
