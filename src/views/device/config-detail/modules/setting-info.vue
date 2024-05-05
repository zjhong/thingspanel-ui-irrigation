<script setup lang="ts">
import { ref } from 'vue';
import { NButton, useDialog } from 'naive-ui';
import { router } from '@/router';
import { deviceConfigDel } from '@/service/api/device';

interface Props {
  configInfo?: object | any;
}

const props = withDefaults(defineProps<Props>(), {
  configInfo: null
});
const dialog = useDialog();
// const message = useMessage();
const deleteConfig = () => {
  dialog.warning({
    title: '提示',
    content: '请确认是否删除该设备配置？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deviceConfigDel({ id: props.configInfo.id });
      // message.success('操作成功');
      router.back();
    }
  });
};
const showModal = ref(false);
</script>

<template>
  <div class="flex-col gap-30px p-10px">
    <div class="">
      <div class="m-b-10px">自动创建设备</div>
      <div class="m-b-10px">通过一型一密动态获取证书创建设备</div>
      <NButton class="" type="primary" @click="showModal = true">配置</NButton>
    </div>
    <div class="">
      <div class="m-b-10px">设备在线配置</div>
      <NButton class="" type="primary" @click="showModal = true">配置</NButton>
    </div>
    <div>
      <div class="m-b-10px color-error-500">删除设备配置</div>
      <NButton type="error" @click="deleteConfig">删除</NButton>
    </div>

    <n-modal v-model:show="showModal" preset="dialog" title="配置自动创建设备" :show-icon="false">
      <div class="mb4">允许设备自动创建</div>
      <n-switch class="mb-4 mt-4" />
      <div class="mb4">复制一型一密设备的密码</div>
      <NButton type="success">复制</NButton>
      <NFlex justify="end">
        <NButton @click="showModal = false">取消</NButton>
        <NButton type="primary" @click="showModal = false">保存</NButton>
      </NFlex>
    </n-modal>
  </div>
</template>

<style scoped></style>
