<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="$t('page.login.resetPwd.title')" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="24" :label="$t('page.user.form.email')" path="email">
          <n-input v-model:value="formModel.email" readonly />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.user.form.password')" path="password">
          <n-input v-model:value="formModel.password" type="password" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" :label="$t('page.user.form.confirmPwd')" path="confirmPwd">
          <n-input v-model:value="formModel.confirmPwd" type="password" />
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
import { ref, computed, reactive, watch, toRefs } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'
import { editUser } from '@/service'
import { formRules, getConfirmPwdRule } from '@/utils'

export interface Props {
  /** 弹窗可见性 */
  visible: boolean
  /** 编辑的表格行数据 */
  editData?: UserManagement.User | null
}

defineOptions({ name: 'EditPasswordModal' })

const props = withDefaults(defineProps<Props>(), {
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

const formRef = ref<HTMLElement & FormInst>()

type FormModel = Pick<UserManagement.User, 'email'> & {
  password: string
  confirmPwd: string
}

const formModel = reactive<FormModel>(createDefaultFormModel())

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  email: formRules.email,
  password: formRules.pwd,
  confirmPwd: getConfirmPwdRule(toRefs(formModel).password)
}

function createDefaultFormModel(): FormModel {
  return {
    email: '',
    password: '',
    confirmPwd: ''
  }
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
  if (props.editData) {
    handleUpdateFormModel(props.editData)
  }
}

async function handleSubmit() {
  await formRef.value?.validate()
  const data: any = await editUser(formModel)
  if (!data.error) {
    window.$message?.success(data.msg)
    emit('success')
    handleUpdateFormModel(createDefaultFormModel())
    closeModal()
  }
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
