<template>
  <n-upload
    :action="url + '/file/up'"
    :headers="{
      'x-token': localStg.get('token') || ''
    }"
    :data="{ type: 'image' }"
    :default-file-list="dataList"
    list-type="image-card"
    :accept="accept"
    :max="1"
    @before-upload="beforeUpload"
    @finish="handleFinish"
    @error="handleError"
  ></n-upload>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
// eslint-disable-next-line import/order
import { getServiceEnvConfig } from '~/.env-config'
const url = ref(getServiceEnvConfig(import.meta.env).url)
defineOptions({ name: 'UploadFile' })
// eslint-disable-next-line import/order
import type { UploadFileInfo } from 'naive-ui'
import { localStg } from '@/utils'
import { STATIC_BASE_URL } from '~/src/config/config'
export interface Props {
  /**
   * 选取文件的类型
   */
  accept: string
  /** 上传的文件类型 */
  fileType: string[]
  value: string | null | undefined
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/png, image/jpeg, image/jpg, image/gif',
  fileType: () => ['png', 'jpeg', 'jpg', 'gif']
})
const dataList: Ref<UploadFileInfo[]> = ref(
  props.value?.split(',').map(item => ({ url: item.replace('.', STATIC_BASE_URL) })) || []
) as Ref<UploadFileInfo[]>

interface Emits {
  (e: 'update:value', val: string): void
  (e: 'success', file: UploadFileInfo): void
}

const emit = defineEmits<Emits>()

async function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  let isImg: boolean = false
  if (props.fileType.length) {
    let fileExtension = ''
    if (data.file?.name.lastIndexOf('.') > -1) {
      fileExtension = data.file?.name.slice(data.file?.name.lastIndexOf('.') + 1)
    }
    isImg = props.fileType.some(type => {
      if (data.file.file?.type && data.file.file?.type.indexOf(type) > -1) return true
      if (fileExtension && fileExtension.indexOf(type) > -1) return true
      return false
    })
  } else if (data.file.file?.type && data.file.file?.type.indexOf('image') > -1) {
    isImg = true
  }
  if (!isImg) {
    window.$message?.error(`文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件!`)
    return false
  }
  return true
}

function handleFinish({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  const response = JSON.parse((event?.target as XMLHttpRequest).response)
  window.$message?.success(response.message)
  emit('update:value', response.data.path)
  emit('success', file)
}

function handleError({ event }: { event?: ProgressEvent }) {
  window.$message?.error((event?.target as XMLHttpRequest).response || '文件上传失败，请重试')
}
</script>
