<template>
  <n-upload
    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
    accept="image/png, image/jpeg, image/jpg, image/jif"
    :show-file-list="false"
    @before-upload="beforeUpload"
    @finish="handleFinish"
    @error="handleError"
  >
    <n-button type="primary">{{ text }}</n-button>
  </n-upload>
</template>

<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
defineOptions({ name: 'UploadFile' })

export interface Props {
  /** 按钮文字 */
  text: string
  /** 上传的文件类型 */
  fileType: string[]
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  fileType: () => ['png', 'jpeg', 'jpg', 'jif']
})

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
  window.$message?.success((event?.target as XMLHttpRequest).response)
  const ext = file.name.split('.')[1]
  file.name = `更名.${ext}`
  file.url = '__HTTPS__://www.mocky.io/v2/5e4bafc63100007100d8b70f'
  emit('update:value', file.url)
  emit('success', file)
}

function handleError({ event }: { event?: ProgressEvent }) {
  window.$message?.error((event?.target as XMLHttpRequest).response || '文件上传失败，请重试')
}
</script>
