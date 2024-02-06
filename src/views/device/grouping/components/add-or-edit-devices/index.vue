<template>
  <!-- Modal component to display a form with tree selection, input field, and textarea -->
  <n-modal v-model:show="showModal">
    <n-card :bordered="false" :title="props.isEdit ? '新增分组' : '编辑分组'" size="huge" style="width: 600px">
      <n-form ref="formRef" :model="formItem" :rules="rules" label-placement="left" label-width="auto">
        <!-- Parent group selection using tree select component -->
        <n-form-item :rules="[rules.parent_id]" label="父分组" path="parent_id">
          <n-tree-select
            v-model:value="formItem.parent_id"
            :options="options"
            default-expand-all
            key-field="id"
            label-field="name"
          ></n-tree-select>
        </n-form-item>
        <!-- Group name input field -->
        <n-form-item :rules="[rules.name]" label="分组名称" path="name">
          <n-input v-model:value="formItem.name" />
        </n-form-item>
        <!-- Description textarea for optional input -->
        <n-form-item label="描述" path="description">
          <n-input v-model:value="formItem.description" type="textarea" />
        </n-form-item>
        <!-- Form action buttons -->
        <div style="display: flex; justify-content: flex-end; gap: 8px">
          <n-button @click="handleSubmit">确定</n-button>
          <n-button @click="handleClose">取消</n-button>
        </div>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { deviceGroup, deviceGroupTree } from '@/service/api/device'

interface Group {
  id: string
  parent_id: string
  tier: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  remark: string | null
  tenant_id: string
}

interface TreeNode {
  group: Group
  children?: TreeNode[] // TreeNode类型的可选数组，用于描述子节点
}
const showModal = ref<boolean>(false)
defineExpose({ showModal })
// Props received from parent component
const props = defineProps({
  isEdit: Boolean
  // editData: { type: Object, required: false, default: null }
})
const message = useMessage()
const formRef = ref<HTMLElement & FormInst>()
const formItem = ref({
  id: '', // Used for identification in edit mode
  parent_id: '',
  name: '',
  description: ''
})

// Tree select options
const options = ref()

// Form validation rules
const rules: FormRules = {
  parent_id: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择父分组'
  },
  Name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入分组名称'
  }
}
interface opNode {
  id?: string
  name?: string
  children?: opNode[] // TreeNode类型的可选数组，用于描述子节点
}
// Extract id and name for tree select options
const extractIdAndName = (data: TreeNode[]): opNode[] => {
  const res = data?.map(node => ({
    id: node.group.id,
    name: node.group.name,
    children: node.children ? extractIdAndName(node.children) : []
  }))
  return res
}
// Fetch options for tree select and handle edit mode data echo back
const getOptions = async () => {
  const { data } = await deviceGroupTree({})
  options.value = [
    {
      id: '0', // Root node for tree select
      name: '分组',
      children: data?.map(item => ({
        id: item.group.id,
        name: item.group.name,
        children: item.children ? extractIdAndName(item.children) : []
      }))
    }
  ]
}

// Submit form data
const handleSubmit = async () => {
  await formRef?.value?.validate()
  await deviceGroup(formItem.value)
  await getOptions()
  showModal.value = false
  // eslint-disable-next-line require-atomic-updates
  if (formItem?.value) {
    formItem.value = {
      id: '',
      parent_id: '',
      name: '',
      description: ''
    }
  }

  message.success('新增成功')
  // Implement API call for form submission here
}

// Close modal and reset form fields
const handleClose = () => {
  showModal.value = false
  formItem.value = {
    id: '',
    parent_id: '',
    name: '',
    description: ''
  }
}

onMounted(getOptions)

// Watch for editData changes to handle edit mode data echo back
// watch(
//   () => props.editData,
//   newVal => {
//     if (props.isEdit && newVal) {
//       formItem.value = { ...newVal }
//     }
//   },
//   { deep: true, immediate: true }
// )

// Expose showModal for parent component
</script>
