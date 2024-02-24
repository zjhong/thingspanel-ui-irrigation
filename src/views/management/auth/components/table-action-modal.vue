<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-800px">
    <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.parent')" path="parent_id">
          <n-tree-select
            v-model:value="formModel.parent_id"
            :options="parentOptions"
            label-field="description"
            key-field="id"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.title')" path="description">
          <n-input v-model:value="formModel.description" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.multilingual')" path="multilingual">
          <n-input v-model:value="formModel.multilingual" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.name')" path="element_code">
          <n-input v-model:value="formModel.element_code" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.path')" path="param1">
          <n-input v-model:value="formModel.param1" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.componentType')" path="param3">
          <n-select v-model:value="formModel.param3" :options="routeComponentTypeOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.icon')" path="param2">
          <icon-select v-model:value="formModel.param2" :icons="icons" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.order')" path="orders">
          <n-input-number v-model:value="formModel.orders" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.type')" path="element_type">
          <n-radio-group v-model:value="formModel.element_type">
            <n-radio v-for="item in routeTypeOptions" :key="item.value" :value="Number(item.value)">
              {{ item.label }}
            </n-radio>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" :label="$t('page.management.auth.form.authority')" path="authority">
          <n-checkbox-group v-model:value="formModel.authority">
            <n-space item-style="display: flex;">
              <n-checkbox v-for="item in routeSysFlagOptions" :key="item.value" :value="item.value" :label="item.label">
                {{ item.label }}
              </n-checkbox>
            </n-space>
          </n-checkbox-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('common.remark')">
          <n-input v-model:value="formModel.remark" type="textarea" />
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
import type { FormInst } from 'naive-ui'
import { routeComponentTypeOptions, routeTypeOptions, routeSysFlagOptions } from '@/constants'
import { addElement, editElement } from '@/service'
import { createRequiredFormRule, deepClone } from '@/utils'
import { $t } from '~/src/locales'
import { icons } from '../../../plugin/icon/icons'

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
  editData?: CustomRoute.Route | null
  tableList: CustomRoute.Route[]
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'TableActionModal' })

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
})

interface Emits {
  (e: 'update:visible', visible: boolean): void
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
    add: $t('common.add'),
    edit: $t('common.edit')
  }
  return titles[props.type]
})

const parentOptions = computed(() => {
  return props.tableList.map((item: CustomRoute.Route) => {
    return JSON.parse(JSON.stringify(item))
  })
})

const formRef = ref<HTMLElement & FormInst>()

type FormModel = Pick<
  CustomRoute.Route,
  | 'parent_id'
  | 'element_code'
  | 'param1'
  | 'param3'
  | 'element_type'
  | 'authority'
  | 'remark'
  | 'multilingual'
  | 'param2'
  | 'orders'
  | 'description'
>

const formModel = reactive<FormModel>(createDefaultFormModel())

const rules = {
  description: createRequiredFormRule($t('common.pleaseCheckValue')),
  element_code: createRequiredFormRule($t('common.pleaseCheckValue')),
  authority: createRequiredFormRule($t('common.pleaseCheckValue'))
}

function createDefaultFormModel(): FormModel {
  return {
    parent_id: '0',
    element_code: '',
    param1: '',
    param3: 'basic',
    multilingual: 'default',
    param2: '',
    orders: 1,
    description: '',
    element_type: 1,
    authority: [],
    remark: ''
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
  const formData = deepClone(formModel)
  formData.parent_id = formData.parent_id || '0'
  formData.authority = JSON.stringify(formData.authority)
  let data: any
  if (props.type === 'add') {
    data = await addElement(formData)
  } else if (props.type === 'edit') {
    data = await editElement(formData)
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
