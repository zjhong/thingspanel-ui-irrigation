<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="服务名称" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="类别" path="serviceType">
          <n-select v-model:value="formModel.serviceType" :options="serviceManagementTypeOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="介绍">
          <n-input v-model:value="formModel.desc" type="textarea" placeholder="" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="作者">
          <n-input v-model:value="formModel.author" placeholder="" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="版本">
          <n-input v-model:value="formModel.version" placeholder="" />
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
import { serviceManagementTypeOptions } from '@/constants'
import { createRequiredFormRule } from '@/utils'

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
  editData?: ServiceManagement.Service | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'TableActionModal' })

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
})

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'getTableData'): void
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
    add: '添加服务',
    edit: '编辑服务'
  }
  return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

type FormModel = Pick<ServiceManagement.Service, 'name' | 'serviceType' | 'desc' | 'author' | 'version'>

const formModel = reactive<FormModel>(createDefaultFormModel())

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule('请输入规则名称'),
  serviceType: createRequiredFormRule('请选择签名方式'),
  desc: createRequiredFormRule('请输入描述'),
  author: createRequiredFormRule('请输入appKey'),
  version: createRequiredFormRule('请输入推送数据间隔')
}

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    serviceType: null,
    desc: null,
    author: null,
    version: null
  }
}

function handleUpdateFormModel(model: Partial<FormModel>) {
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
        handleUpdateFormModel(props.editData)
      }
    }
  }

  handlers[props.type]()
}

async function handleSubmit() {
  await formRef.value?.validate()
  const titles: Record<ModalType, string> = {
    add: '添加',
    edit: '编辑'
  }
  window.$message?.success(`${titles[props.type]}成功!`)
  emit('getTableData')
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
