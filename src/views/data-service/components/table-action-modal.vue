<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" label="规则名称" path="name">
          <n-input v-model:value="formModel.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="签名方式" path="signMode">
          <n-select v-model:value="formModel.signMode" :options="dataServiceSignModeOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="IP白名单">
          <n-input v-model:value="formModel.ip" type="textarea" placeholder="多个ip用竖线分割" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="接口支持标志" path="flag">
          <n-select v-model:value="formModel.flag" :options="dataServiceFlagOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="描述">
          <n-input v-model:value="formModel.desc" type="textarea" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="SQL编写辅助">
          <div class="flex-1">
            <n-select
              v-model:value="formModel.SQLWritingAid"
              :options="dataServiceFlagOptions"
              @update:value="handleChangeFlag"
            />
            <n-data-table :columns="columns" :data="tableData" class="flex-1-hidden mt-20px" />
          </div>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="SQL">
          <n-input v-model:value="formModel.SQL" />
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
import type { Ref } from 'vue'
import type { FormInst, FormItemRule, DataTableColumns, SelectOption } from 'naive-ui'
import { dataServiceSignModeOptions, dataServiceFlagOptions } from '@/constants'
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
  editData?: DataService.Data | null
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
    add: '添加规则',
    edit: '编辑规则'
  }
  return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

type FormModel = Pick<
  DataService.Data,
  'name' | 'signMode' | 'ip' | 'flag' | 'desc' | 'appKey' | 'dataInterval' | 'SQL' | 'status' | 'SQLWritingAid'
>

const formModel = reactive<FormModel>(createDefaultFormModel())

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule('请输入规则名称'),
  signMode: createRequiredFormRule('请选择签名方式'),
  ip: createRequiredFormRule('请输入IP白名单'),
  flag: createRequiredFormRule('请选择接口支持标志'),
  desc: createRequiredFormRule('请输入描述'),
  appKey: createRequiredFormRule('请输入appKey'),
  dataInterval: createRequiredFormRule('请输入推送数据间隔'),
  SQL: createRequiredFormRule('请输入SQL'),
  status: createRequiredFormRule('请选择状态'),
  SQLWritingAid: createRequiredFormRule('请选择状态')
}

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    signMode: null,
    ip: null,
    flag: null,
    desc: null,
    appKey: '',
    dataInterval: null,
    SQL: null,
    status: null,
    SQLWritingAid: null
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

interface Columns {
  name: string
  dataType: string
  annotation: string
}

const columns: Ref<DataTableColumns<Columns>> = ref([
  {
    key: 'name',
    title: '字段名',
    align: 'left'
  },
  {
    key: 'dataType',
    title: '数据类型',
    align: 'left'
  },
  {
    key: 'annotation',
    title: '注释',
    align: 'left'
  }
]) as Ref<DataTableColumns<Columns>>

const tableData = ref<Columns[]>([])
function setTableData(data: Columns[]) {
  tableData.value = data
}

function handleChangeFlag(value: string, option: SelectOption) {
  console.log(value)
  console.log(option)
  setTableData([{ name: 'ceshi', dataType: 'ceshi', annotation: 'ceshi' }])
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
