<template>
  <n-spin :show="loading">
    <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="系统标题" path="system_name">
          <n-input v-model:value="formModel.system_name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24">
          <div class="w-120px"></div>
          <n-space class="text-center">
            <div>
              <div>首页和后台 logo</div>
              <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.logo_background" />
              <upload-image
                v-model:value="formModel.logo_background"
                class="mt-10px"
                text="更换 logo"
                :file-type="['jpg', 'png', 'jpeg']"
              ></upload-image>
            </div>
            <div class="ml-20px">
              <div>加载页面 logo</div>
              <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.logo_loading" />
              <upload-image
                v-model:value="formModel.logo_loading"
                class="mt-10px"
                text="更换 logo"
                :file-type="['jpg', 'png', 'jpeg', 'jif']"
              ></upload-image>
            </div>
            <div class="ml-20px">
              <div>站标 logo</div>
              <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.logo_cache" />
              <upload-image
                v-model:value="formModel.logo_cache"
                class="mt-10px"
                text="更换 logo"
                :file-type="['jpg', 'png', 'jpeg']"
              ></upload-image>
            </div>
            <div class="ml-20px">
              <div>背景图片</div>
              <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.home_background" />
              <upload-image
                v-model:value="formModel.home_background"
                class="mt-10px"
                text="更换"
                :file-type="['jpg', 'png', 'jpeg']"
              ></upload-image>
            </div>
          </n-space>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" class="mt-60px">
          <div class="w-120px"></div>
          <n-button class="w-72px" type="primary" @click="handleSubmit">保存</n-button>
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="start"></n-space>
    </n-form>
  </n-spin>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { fetchThemeSetting, editThemeSetting } from '@/service'
import { useLoading } from '@/hooks'
import { deepClone } from '@/utils'
import UploadImage from './upload-image.vue'
const { loading, startLoading, endLoading } = useLoading(false)

const formModel = reactive<GeneralSetting.ThemeSetting>(createDefaultFormModel())

function setTableData(data: GeneralSetting.ThemeSetting) {
  Object.assign(formModel, data)
}

async function getGeneralSetting() {
  startLoading()
  const { data } = await fetchThemeSetting()
  if (data) {
    const list: ApiGeneralSetting.ThemeSetting[] = data.list
    if (list.length) {
      setTableData(list[0])
    }
  }
  endLoading()
}

function createDefaultFormModel(): GeneralSetting.ThemeSetting {
  return {
    id: '',
    system_name: '',
    logo_background: '',
    logo_cache: '',
    logo_loading: '',
    home_background: ''
  }
}

async function handleSubmit() {
  startLoading()
  const formData = deepClone(formModel)
  const data: any = await editThemeSetting(formData)
  if (!data.error) {
    window.$message?.success(data.msg)
    endLoading()
    getGeneralSetting()
  }
}

function init() {
  getGeneralSetting()
}

init()
</script>
<style lang="scss"></style>
