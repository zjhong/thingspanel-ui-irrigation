<script setup lang="ts">
import { MemberNotificationOptions } from '@/constants/business';
import { createRequiredFormRule } from '@/utils/form/rule';
import { FormItemRule } from 'naive-ui';
import { reactive, ref } from 'vue';
import { getCurrentName, handleDeleteMember, handleScroll, handleSearch, handleUpdateMember, notificationTypeOptions } from '../utils';
const loading = ref(false)
type FormModel = Pick<DataService.Data, any>;

const formModel = reactive<FormModel>(createDefaultFormModel());
function createDefaultFormModel(): FormModel {
  return {
    name: '',
    signMode: null
  };
}

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule('请输入规则名称'),
  signMode: createRequiredFormRule('请选择签名方式'),
  ip: createRequiredFormRule('请输入IP白名单')
};

const props = withDefaults(
  defineProps<{
    index: number;
    selectedNotificationType: string[]
  }>(),
  {
    index: 0,
    notificationType: []
  }
)
const selectedMember = ref(getCurrentName(props.index))
const selectNotificationType = ref(props.selectedNotificationType)

const handleDelete = (index: number) => {
  handleDeleteMember(index)
}

const handleUpdate = () => {
  handleUpdateMember(props.index, { name: selectedMember.value || '', notificationType: selectNotificationType.value })
}

const handleChange = (value) => {
  handleUpdate()
}

</script>

<template>
  <NForm ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
    <NFormItem path="name">
      <NSelect filterable placeholder="选择用户" v-model:value="selectedMember" :options="notificationTypeOptions" clearable
        remote @search="handleSearch" @scroll="handleScroll" @update:value="handleChange" :loading="loading"
        style="width: 160px; margin-right: 16px;" />
      <NCheckboxGroup v-model:value="selectNotificationType" @click="handleUpdate">
        <NSpace item-style="display: flex;">
          <NCheckbox v-for="item in MemberNotificationOptions" :key="item.value" :value="item.value"
            :label="item.label">
            {{ item.label }}
          </NCheckbox>
        </NSpace>
      </NCheckboxGroup>
      <NButton type="error" size='small' style="margin-left: 12px;" @click="() => handleDelete(index)">删除</NButton>
    </NFormItem>
  </NForm>
</template>

<style lang="scss" scoped></style>