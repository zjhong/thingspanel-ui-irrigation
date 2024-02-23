<template>
  <n-spin :show="loading">
    <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item
          :span="24"
          :label="$t('page.management.setting.themeSetting.form.systemTitle')"
          path="system_name"
        >
          <n-input v-model:value="formModel.system_name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24">
          <div class="w-120px"></div>
          <n-space class="text-center">
            <div>
              <div>{{ $t('page.management.setting.themeSetting.form.homeAndBackendLogo') }}</div>
              <n-image
                width="140"
                class="h-140px mt-20px"
                object-fit="contain"
                :src="url.origin + formModel.logo_background?.slice(1)"
              />
              <upload-image
                v-model:value="formModel.logo_background"
                accept="image/png, image/jpeg, image/jpg"
                class="mt-10px"
                :text="$t('page.management.setting.themeSetting.changeLogo')"
                :file-type="['jpg', 'png', 'jpeg']"
              ></upload-image>
            </div>
            <div class="ml-20px">
              <div>{{ $t('page.management.setting.themeSetting.form.loadingPageLogo') }}</div>
              <n-image
                width="140"
                class="h-140px mt-20px"
                object-fit="contain"
                :src="url.origin + formModel.logo_loading?.slice(1)"
              />
              <upload-image
                v-model:value="formModel.logo_loading"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                class="mt-10px"
                :text="$t('page.management.setting.themeSetting.changeLogo')"
                :file-type="['jpg', 'png', 'jpeg', 'gif']"
              ></upload-image>
            </div>
            <div class="ml-20px">
              <div>{{ $t('page.management.setting.themeSetting.form.websiteLogo') }}</div>
              <n-image
                width="140"
                class="h-140px mt-20px"
                object-fit="contain"
                :src="url.origin + formModel.logo_cache?.slice(1)"
              />
              <upload-image
                v-model:value="formModel.logo_cache"
                accept="image/png, image/jpeg, image/jpg"
                class="mt-10px"
                :text="$t('page.management.setting.themeSetting.changeLogo')"
                :file-type="['jpg', 'png', 'jpeg']"
              ></upload-image>
            </div>
            <div class="ml-20px">
              <div>{{ $t('page.management.setting.themeSetting.form.background') }}</div>
              <n-image
                width="140"
                class="h-140px mt-20px"
                object-fit="contain"
                :src="url.origin + formModel.home_background?.slice(1)"
              />
              <upload-image
                v-model:value="formModel.home_background"
                accept="image/png, image/jpeg, image/jpg"
                class="mt-10px"
                :text="$t('page.management.setting.themeSetting.changeLogo')"
                :file-type="['jpg', 'png', 'jpeg']"
              ></upload-image>
            </div>
          </n-space>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" class="mt-60px">
          <div class="w-120px"></div>
          <n-button class="w-72px" type="primary" @click="handleSubmit">{{ $t('common.save') }}</n-button>
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="start"></n-space>
    </n-form>
  </n-spin>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { fetchThemeSetting, editThemeSetting } from '@/service'
import { useLoading } from '@/hooks'
import { deepClone } from '@/utils'
import UploadImage from './upload-image.vue'
// eslint-disable-next-line import/order
import { getServiceEnvConfig } from '~/.env-config'
const url = ref(new URL(getServiceEnvConfig(import.meta.env).url))

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
