<script setup lang="ts">
import { reactive, ref } from 'vue';
import { NButton, useDialog } from 'naive-ui';
import { router } from '@/router';
import { deviceConfigDel, deviceConfigEdit } from '@/service/api/device';

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
const modalIndex = ref(1);
const onlinejson = reactive({
  online_timeout: '',
  heartbeat: ''
});
const onDialogVisble = () => {
  showModal.value = !showModal.value;
};
const onOpenDialogModal = (val: number) => {
  modalIndex.value = val;
  onDialogVisble();
  if (modalIndex.value === 1) {
    console.log('1');
  } else {
    console.log('2');
    onlinejson.online_timeout = '';
    onlinejson.heartbeat = '';
  }
};

const onSubmit = async () => {
  onDialogVisble();
  if (modalIndex.value === 1) {
    console.log('1');
  } else {
    await deviceConfigEdit({
      id: props.configInfo.id,
      other_config: JSON.stringify({
        online_timeout: Number(onlinejson.online_timeout),
        heartbeat: Number(onlinejson.heartbeat)
      })
    });
  }
};
</script>

<template>
  <div class="flex-col gap-30px p-10px">
    <div class="">
      <div class="m-b-10px">自动创建设备</div>
      <div class="m-b-10px">通过一型一密动态获取证书创建设备</div>
      <NButton class="" type="primary" @click="onOpenDialogModal(1)">配置</NButton>
    </div>
    <div class="">
      <div class="m-b-10px">设备在线配置</div>
      <NButton class="" type="primary" @click="onOpenDialogModal(2)">配置</NButton>
    </div>
    <div>
      <div class="m-b-10px color-error-500">删除设备配置</div>
      <NButton type="error" @click="deleteConfig">删除</NButton>
    </div>

    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :title="modalIndex === 1 ? '配置自动创建设备' : '设备在线配置'"
      :show-icon="false"
    >
      <template v-if="modalIndex === 1">
        <dl class="flex-col gap-20px">
          <dd>允许设备自动创建</dd>
          <dd>
            <n-switch />
          </dd>
          <dd>复制一型一密设备的密码</dd>
          <dd>
            <NButton type="success">复制</NButton>
          </dd>
        </dl>
      </template>
      <template v-else>
        <dl class="m-b-20px flex-col">
          <dt class="m-b-5px font-900">超时时间（分钟）</dt>
          <dd class="m-b-10px">
            >0代表启用超时功能，用来判断设备是否异常在线。当设备在该时间内未上报遥测数据，平台会认为该设备已离线
          </dd>
          <dd class="m-b-20px max-w-220px">
            <n-input v-model:value="onlinejson.online_timeout" placeholder=""></n-input>
          </dd>
          <dt class="m-b-5px font-900">心跳判断（秒）</dt>
          <dd class="m-b-10px">>0代表启用心跳判断，系统仅按照遥测数据的上报作为设备的心跳判断在线离线状态</dd>
          <dd class="max-w-220px">
            <n-input v-model:value="onlinejson.heartbeat" type="text" placeholder=""></n-input>
          </dd>
        </dl>
      </template>

      <NFlex justify="end">
        <NButton @click="onDialogVisble">取消</NButton>
        <NButton type="primary" @click="onSubmit">保存</NButton>
      </NFlex>
    </n-modal>
  </div>
</template>

<style scoped></style>
