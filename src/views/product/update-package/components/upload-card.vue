<script setup lang="ts">
import { computed, ref } from 'vue';
// eslint-disable-next-line import/order

// eslint-disable-next-line import/order
import type { UploadFileInfo } from 'naive-ui';
import { generateUUID, getFileName } from '@/utils/common/tool';
import { localStg } from '@/utils/storage';
import { STATIC_BASE_URL } from '@/constants/common';
import { $t } from '~/src/locales';
import { createServiceConfig } from '~/env.config';

const { otherBaseURL } = createServiceConfig(import.meta.env);
const url = ref(new URL(otherBaseURL.demo));
defineOptions({ name: 'UploadFile' });

export interface Props {
  /** 选取文件的类型 */
  accept: string;
  /** 上传的文件类型 */
  fileType: string[];
  value: string | null | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'file',
  fileType: () => ['exe', 'apk', 'zip', 'ipa', 'jpeg', 'jpg', 'png', 'gif']
});
const dataList = computed((): UploadFileInfo[] => {
  if (!props.value) {
    return [];
  }
  return (
    props.value?.split(',').map((item: string) => ({
      id: generateUUID(),
      name: getFileName(item),
      status: 'finished',
      url: item.replace('.', STATIC_BASE_URL)
    })) || []
  );
});

interface Emits {
  (e: 'update:value', val: string): void;
  (e: 'success', file: UploadFileInfo): void;
}

const emit = defineEmits<Emits>();

async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  let isImg: boolean = false;
  if (props.fileType.length) {
    let fileExtension = '';
    if (data.file?.name.lastIndexOf('.') > -1) {
      fileExtension = data.file?.name.slice(data.file?.name.lastIndexOf('.') + 1);
    }
    isImg = props.fileType.some(type => {
      if (data.file.file?.type && data.file.file?.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.includes(type)) return true;
      return false;
    });
  } else if (data.file.file?.type && data.file.file?.type.indexOf('image') > -1) {
    isImg = true;
  }
  if (!isImg) {
    window.$message?.error(`文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件!`);
    return false;
  }
  return true;
}

function handleFinish({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  const response = JSON.parse((event?.target as XMLHttpRequest).response);
  window.$message?.success(response.message);
  emit('update:value', response.data.path);
  emit('success', file);
}

function handleError({ event }: { event?: ProgressEvent }) {
  window.$message?.error((event?.target as XMLHttpRequest).response || '文件上传失败，请重试');
}
</script>

<template>
  <NUpload
    :action="url + '/file/up'"
    :headers="{
      'x-token': localStg.get('token') || ''
    }"
    :data="{ type: 'image' }"
    :default-file-list="dataList"
    :accept="accept"
    :max="1"
    @before-upload="beforeUpload"
    @finish="handleFinish"
    @error="handleError"
  >
    <NButton>{{ $t('page.product.update-package.package') }}</NButton>
  </NUpload>
</template>
