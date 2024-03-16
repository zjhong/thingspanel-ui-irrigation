<script setup lang="tsx">
import { computed, reactive, ref, toRefs, watch } from 'vue';
import type { Ref } from 'vue';
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
// import { genderOptions } from '@/constants'
// import { controlModalLabels } from '@/constants/business';
import { addUser, editUser } from '@/service/api/auth';
import { createRequiredFormRule, formRules, getConfirmPwdRule } from '@/utils/form/rule';
import DevicesModal from './devices-modal.vue';
import { $t } from '~/src/locales';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 弹窗类型 add: 新增 edit: 编辑 */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: UserManagement.User | null;
}
const modalType = ref<ModalType>('add');
const { bool: devicesVisible, setTrue: openDevicesModal } = useBoolean();
export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  /** 点击协议 */
  (e: 'success'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: $t('page.irrigation.group.addGroupPlane'),
    edit: $t('common.edit')
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<UserManagement.User, 'email' | 'name' | 'phone_number' | 'gender' | 'remark'> & {
  password: string;
  confirmPwd: string;
  startTime: number;
};

const formModel = reactive<FormModel>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule($t('common.pleaseCheckValue')),
  gender: createRequiredFormRule($t('common.pleaseCheckValue')),
  phone_number: formRules.phone,
  email: formRules.email,
  password: formRules.pwd,
  startTime: createRequiredFormRule($t('common.pleaseCheckValue')),
  confirmPwd: getConfirmPwdRule(toRefs(formModel).password),
  remark: createRequiredFormRule($t('common.pleaseCheckValue'))
};

function openDevicesModalFn() {
  openDevicesModal();
}

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    gender: null,
    phone_number: '',
    email: '',
    password: '',
    confirmPwd: '',
    remark: '',
    startTime: 0
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  let data: any;
  if (props.type === 'add') {
    data = await addUser(formModel);
  } else if (props.type === 'edit') {
    data = await editUser(formModel);
  }
  if (!data.error) {
    window.$message?.success(data.msg);
    emit('success');
  }
  closeModal();
}
const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    key: 'email',
    title: () => $t('page.irrigation.group.detail.spaceOrArea'),
    align: 'center'
  },
  {
    key: 'name',
    title: () => $t('page.irrigation.group.deviceName'),
    align: 'center'
  }
]) as Ref<DataTableColumns<UserManagement.User>>;
watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-800px">
    <NForm ref="formRef" label-placement="left" :label-width="100" :model="formModel" :rules="rules">
      <NGrid :cols="2" :x-gap="18">
        <NGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.planName')" path="name">
            <NInput v-model:value="formModel.name" class="important-w-200px" />
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.startTime')" path="name">
            <NDatePicker v-model:value="formModel.startTime" type="datetime" clearable />
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.deviceType')" path="name">
            <NSelect v-model:value="formModel.name" class="important-w-200px" clearable :options="[]" />
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.addDevice')" path="name">
            <NButton type="info" @click="openDevicesModalFn">
              {{ $t('page.irrigation.group.clickToAdd') }}
            </NButton>
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.controlType')" path="name">
            <NRadioGroup v-model:value="formModel.name" name="radiogroup">
              <NSpace>
                <NRadio value="song.value">{{ $t('page.irrigation.duration') }}</NRadio>
                <NRadio value="song.value">{{ $t('page.irrigation.capacity') }}</NRadio>
              </NSpace>
            </NRadioGroup>
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.duration')" path="name">
            <NInput v-model:value="formModel.name" class="important-w-100px" />
            <label class="ml-10px mr-20px text-nowrap">{{ $t('page.irrigation.hour') }}</label>
            <NInput v-model:value="formModel.name" class="important-w-100px" />
            <label class="ml-10px text-nowrap">{{ $t('page.irrigation.minute') }}</label>
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.capacity')" path="name">
            <NInput v-model:value="formModel.name" class="important-w-200px" />
            <label class="ml-10px mr-20px text-nowrap">L</label>
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.time.doorOpeing')" path="name">
            <NSelect v-model:value="formModel.name" class="w-200px" clearable :options="[]" />
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.controlModel')" path="name">
            <NRadioGroup v-model:value="formModel.name" name="radiogroup">
              <NSpace>
                <NRadio value="song.value">{{ $t('page.irrigation.group.singleControl') }}</NRadio>
                <NRadio value="song.value">{{ $t('page.irrigation.group.loopControl') }}</NRadio>
              </NSpace>
            </NRadioGroup>
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.cycleNumber')" path="name">
            <NSelect v-model:value="formModel.name" class="w-200px" clearable :options="[]" />
          </NFormItemGridItem>
          <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.intervalDuration')" path="name">
            <NInput v-model:value="formModel.name" class="important-w-100px" />
            <label class="ml-10px mr-20px text-nowrap">{{ $t('page.irrigation.hour') }}</label>
            <NInput v-model:value="formModel.name" class="important-w-100px" />
            <label class="ml-10px text-nowrap">{{ $t('page.irrigation.minute') }}</label>
          </NFormItemGridItem>
        </NGridItem>
        <NGridItem>
          <div class="mb-5px">{{ $t('page.irrigation.group.choosedDevice') }}：</div>
          <NDataTable :columns="columns" :data="[]" :pagination="false" :flex-height="true" class="flex-1-hidden" />
        </NGridItem>
      </NGrid>
      <NSpace class="w-full pt-16px" :size="24" justify="end">
        <NButton class="w-72px" @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton class="w-72px" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </NForm>
    <DevicesModal v-model:visible="devicesVisible" :type="modalType" :edit-data="editData" @success="handleSubmit" />
  </NModal>
</template>

<style scoped></style>
