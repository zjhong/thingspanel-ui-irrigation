<template>
  <n-modal v-model:show="modalVisible" :on-after-enter="getOptions" preset="card" :title="title" class="w-800px">
    <n-form ref="formRef" label-placement="left" label-width="auto" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" :label="$t('page.product.update-package.type')" path="package_type">
          <n-select v-model:value="formModel.package_type" :options="packageOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item
          v-if="formModel.package_type === 1"
          :span="12"
          :label="$t('page.product.update-package.version')"
          path="version"
        >
          <n-input v-model:value="formModel.version" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.update-package.versionCode')" path="target_version">
          <n-input v-model:value="formModel.target_version" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.update-package.packageName')" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.update-package.product')" path="product_id">
          <n-select v-model:value="formModel.product_id" :options="productOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.update-package.moduleName')" path="module">
          <n-input v-model:value="formModel.module" />
        </n-form-item-grid-item>
        <!-- signModeOptions -->
        <n-form-item-grid-item :span="12" :label="$t('page.product.update-package.signMode')" path="signature_type">
          <n-select v-model:value="formModel.signature_type" :options="signModeOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.product.update-package.package')" path="package_url">
          <upload-card v-model:value="formModel.package_url" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.product.update-package.desc')" path="description">
          <n-input v-model:value="formModel.description" type="textarea" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.product.update-package.customInfo')" path="additional_info">
          <n-input v-model:value="formModel.additional_info" type="textarea" />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">{{ $t('common.cancel') }}</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'
import { createRequiredFormRule } from '@/utils'
import { addOtaPackage, editOtaPackage } from '~/src/service/product/update-package'
import { $t } from '~/src/locales'
import { signModeOptions, packageOptions } from '~/src/constants'
import { getProductList } from '~/src/service/product/list'
import UploadCard from './upload-card.vue'
const productOptions = ref()
const getOptions = () => {
  getProductList({ page: 1, page_size: 99 }).then(({ data }) => {
    if (data && data.list && data.list.length) {
      productOptions.value = data.list.map((item: productRecord) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    }
  })
}
export interface Props {
  /** 弹窗可见性 */
  visible: boolean
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit'
  /** 编辑的表格行数据 */
  editData?: productPackageRecord | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'TableActionModal' })

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
})

interface Emits {
  (e: 'update:visible', visible: boolean): void
  /** 点击协议 */
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

const modalVisible = computed({
  get() {
    return props.visible
  },
  set(visible) {
    emit('update:visible', visible)
  }
})
const closeModal = () => {
  modalVisible.value = false
}

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: $t('page.product.update-package.packageAdd'),
    edit: $t('page.product.update-package.packageEdit')
  }
  return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

const formModel = reactive<productPackageRecord>(createDefaultFormModel() as productPackageRecord)
type formModelRuleName =
  | 'name'
  | 'version'
  | 'target_version'
  | 'package_type'
  | 'product_id'
  | 'signature_type'
  | 'package_url'
const rules: Record<formModelRuleName, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule($t('page.product.update-package.packageNamePlaceholder')),
  version: createRequiredFormRule($t('page.product.update-package.versionPlaceholder')),
  target_version: createRequiredFormRule($t('page.product.update-package.versionCodePlaceholder')),
  package_type: createRequiredFormRule($t('page.product.update-package.typePlaceholder')),
  product_id: createRequiredFormRule($t('page.product.update-package.productPlaceholder')),
  signature_type: createRequiredFormRule($t('page.product.update-package.signModePlaceholder')),
  package_url: createRequiredFormRule($t('page.product.update-package.packagePlaceholder'))
}

function createDefaultFormModel() {
  return {}
}

function handleUpdateFormModel(model: Partial<productPackageRecord>) {
  Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel()
      handleUpdateFormModel(defaultFormModel)
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData as productPackageRecord)
      }
    }
  }

  handlers[props.type]()
}

async function handleSubmit() {
  await formRef.value?.validate()
  let data: any
  if (props.type === 'add') {
    data = await addOtaPackage(formModel)
  } else if (props.type === 'edit') {
    data = await editOtaPackage(formModel)
  }
  if (!data.error) {
    window.$message?.success(data.msg)
    emit('success')
  }
  closeModal()
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType()
    }
  }
)
</script>

<style scoped></style>
