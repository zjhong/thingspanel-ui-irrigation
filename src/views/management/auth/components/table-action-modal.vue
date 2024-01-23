<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-800px">
    <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="父级菜单" path="parentId">
          <n-tree-select
            v-model:value="formModel.parentId"
            :options="parentOptions"
            label-field="meta.title"
            key-field="path"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="标题" path="meta.title">
          <n-input v-model:value="formModel.meta.title" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="标题（国际化）" path="meta.i18nTitle">
          <n-input v-model:value="formModel.meta.i18nTitle" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="名称" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="path" path="path">
          <n-input v-model:value="formModel.path" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="组件类型" path="component">
          <n-select v-model:value="formModel.component" :options="routeComponentTypeOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="图标" path="meta.icon">
          <icon-select v-model:value="formModel.meta.icon" :icons="icons" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="排序" path="meta.order">
          <n-input-number v-model:value="formModel.meta.order" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="类型" path="type">
          <n-radio-group v-model:value="formModel.type">
            <n-radio v-for="item in routeTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</n-radio>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="访问标识" path="sys_flag">
          <n-radio-group v-model:value="formModel.sys_flag">
            <n-radio v-for="item in routeSysFlagOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="描述">
          <n-input v-model:value="formModel.describe" type="textarea" />
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
import type { FormInst } from 'naive-ui'
import { routeComponentTypeOptions, routeTypeOptions, routeSysFlagOptions } from '@/constants'
import { createRequiredFormRule } from '@/utils'
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
    add: '添加路由',
    edit: '编辑路由'
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
  'parentId' | 'name' | 'path' | 'component' | 'meta' | 'type' | 'sys_flag' | 'describe'
>

const formModel = reactive<FormModel>(createDefaultFormModel())

const rules = {
  'meta.title': createRequiredFormRule('请输入标题'),
  name: createRequiredFormRule('请输入名称')
}

function createDefaultFormModel(): FormModel {
  return {
    parentId: '',
    name: '',
    path: '',
    component: 'basic',
    meta: {
      i18nTitle: 'default',
      icon: '',
      order: 1,
      title: ''
    },
    type: '1',
    sys_flag: '1',
    describe: ''
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
  window.$message?.success('新增成功!')
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
