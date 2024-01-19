<template>
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
            <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.logo_one" />
            <upload-image
              v-model:value="formModel.logo_one"
              class="mt-10px"
              text="更换 logo"
              :file-type="['jpg, png, jpeg']"
            ></upload-image>
          </div>
          <div class="ml-20px">
            <div>加载页面 logo</div>
            <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.logo_two" />
            <upload-image
              v-model:value="formModel.logo_one"
              class="mt-10px"
              text="更换 logo"
              :file-type="['jpg, png, jpeg', 'jif']"
            ></upload-image>
          </div>
          <div class="ml-20px">
            <div>站标 logo</div>
            <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.logo_three" />
            <upload-image
              v-model:value="formModel.logo_one"
              class="mt-10px"
              text="更换 logo"
              :file-type="['jpg, png, jpeg']"
            ></upload-image>
          </div>
          <div class="ml-20px">
            <div>背景图片</div>
            <n-image width="140" class="h-140px mt-20px" object-fit="contain" :src="formModel.home_background" />
            <upload-image
              v-model:value="formModel.logo_one"
              class="mt-10px"
              text="更换"
              :file-type="['jpg, png, jpeg']"
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
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { fetchThemeSetting } from '@/service/demo'
import UploadImage from './upload-image.vue'

const formModel = reactive<GeneralSetting.ThemeSetting>(createDefaultFormModel())

function setTableData(data: GeneralSetting.ThemeSetting) {
  Object.assign(formModel, data)
}

async function getGeneralSetting() {
  const { data } = await fetchThemeSetting()
  if (data) {
    setTableData(data)
  }
}

function createDefaultFormModel(): GeneralSetting.ThemeSetting {
  return {
    id: '',
    system_name: '',
    logo_one: '',
    logo_three: '',
    logo_two: '',
    home_background: ''
  }
}

function handleSubmit() {
  console.log(formModel)
}

function init() {
  getGeneralSetting()
}

init()
</script>
<style lang="scss"></style>
