<template>
  <n-modal v-model:show="modalVisible" preset="card" :on-after-enter="getList" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" :label="$t('page.product.list.productName')" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.list.deviceType')" path="device_type">
          <n-input v-model:value="formModel.device_type" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.list.productNumber')" path="product_model">
          <n-input v-model:value="formModel.product_model" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.list.deviceConfig')" path="device_config_id">
          <n-select v-model:value="formModel.device_config_id" :options="deviceOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.product.list.productKey')" path="product_key">
          <n-input v-model:value="formModel.product_key" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.product.list.productImage')" path="image_url">
          <upload-card
            v-model:value="formModel.image_url"
            accept="image/png, image/jpeg, image/jpg"
            class="mt-10px"
            :file-type="['jpg', 'png', 'jpeg']"
          ></upload-card>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.product.list.productDesc')" path="description">
          <n-input v-model:value="formModel.description" />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'
import { createRequiredFormRule } from '@/utils'
import { $t } from '~/src/locales'
import { addProduct, editProduct, getDeviceList } from '~/src/service/product/list'
import UploadCard from './upload-card.vue'

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
  editData?: otaRecord | null
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
    add: $t('page.product.list.addProduct'),
    edit: $t('page.product.list.editProduct')
  }
  return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()
const deviceOptions = ref()

const getList = () => {
  getDeviceList({
    page: 1,
    page_size: 99
  }).then(({ data }) => {
    const list = data.list || []
    deviceOptions.value = list.map((item: any) => ({ label: item.name, value: item.id })) || []
  })
}
const formModel = reactive<productAdd>(createDefaultFormModel() as productAdd)

const rules: Record<'name' | 'device_type', FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule($t('page.product.list.productNamePlaceholder')),
  device_type: createRequiredFormRule($t('page.product.list.productTypePlaceholder'))
}

function createDefaultFormModel() {
  return {
    name: '',
    device_type: undefined,
    additional_info: undefined,
    description: undefined,
    image_url: undefined,
    product_model: undefined,
    product_type: undefined,
    remark: undefined,
    device_config_id: undefined,
    product_key: undefined
  }
}

function handleUpdateFormModel(model: Partial<otaRecord>) {
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
        handleUpdateFormModel(props.editData as productAdd)
      }
    }
  }

  handlers[props.type]()
}

async function handleSubmit() {
  await formRef.value?.validate()
  let data: any
  if (props.type === 'add') {
    data = await addProduct({ ...formModel, device_type: Number(formModel.device_type as string) })
  } else if (props.type === 'edit') {
    data = await editProduct(formModel)
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
