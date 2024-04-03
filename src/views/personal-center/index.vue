<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-17 09:14:38
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-20 17:23:40
-->
<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NTag, useMessage } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { useAuthStore } from '@/store/modules/auth';
import type { ModalType } from './components/change-information.vue';
import ChangeInformation from './components/change-information.vue';

const { bool: visible, setTrue: openModal } = useBoolean();
const authStore = useAuthStore();
const modalType = ref<ModalType>('amend');
const message = useMessage();
function setModalType(type: ModalType) {
  modalType.value = type;
}

function editName() {
  openModal();
  setModalType('amend');
}
function changePassword() {
  openModal();
  setModalType('changePassword');
}
function modification(e) {
  console.log(895656, e);
  if (!e) {
    useAuthStore();
    message.success('修改成功');
  } else {
    message.error('修改失败');
  }
}
</script>

<template>
  <div class="overflow-hidden">
    <NCard title="个人空间" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="basic-information flex">
        <NTag :bordered="false">基本信息</NTag>
        <NCard>
          <n-grid x-gap="9" :cols="3">
            <n-gi>
              <NCard class="i-flex-vertical" :bordered="false">
                <NSpace vertical>
                  <NForm
                    label-placement="left"
                    :style="{
                      maxWidth: '640px'
                    }"
                  >
                    <NFormItem label="  姓  名" path="inputValue">
                      <span>{{ authStore.userInfo.name }}</span>
                    </NFormItem>
                    <NFormItem label="账户类型" path="inputValue">
                      <span>超管</span>
                    </NFormItem>
                    <NFormItem label="电子邮箱" path="inputValue">
                      <span>{{ authStore.userInfo.email }}</span>
                    </NFormItem>
                    <NFormItem label="手机号码" path="inputValue">
                      <span>{{ authStore.userInfo.phone_number }}</span>
                    </NFormItem>
                  </NForm>
                </NSpace>
              </NCard>
            </n-gi>
            <n-gi>
              <SvgIcon class="editor mt-8 cursor-pointer lg:text-[18px]" local-icon="PencilAlt" @click="editName()" />
            </n-gi>
            <n-gi>
              <NButton class="mt-5" @click="changePassword">修改密码</NButton>
            </n-gi>
          </n-grid>
        </NCard>
      </div>
      <ChangeInformation v-model:visible="visible" :type="modalType" @modification="modification" />
    </NCard>
  </div>
</template>

<style scoped></style>
