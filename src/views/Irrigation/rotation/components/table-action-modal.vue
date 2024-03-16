<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import type { FormInst, FormItemRule } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
// import { genderOptions } from '@/constants'
import { addUser, editUser } from '@/service/api/auth';
import { createRequiredFormRule } from '@/utils/form/rule';
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
const message = useMessage();
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
    add: $t('page.irrigation.rotation.addRotationPlane'),
    edit: $t('common.edit')
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<UserManagement.User, 'name'> & {
  deviceList: Array<any>;
  time: number;
};

const formModel = reactive<FormModel>(createDefaultFormModel());

async function checkDeviceList() {
  message.warning('校验通过但是留意还有警告');
  return new Error('test');
}
const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule($t('common.pleaseCheckValue')),
  deviceList: createRequiredFormRule($t('common.pleaseCheckValue')),
  time: createRequiredFormRule($t('common.pleaseCheckValue'))
};

function openDevicesModalFn() {
  openDevicesModal();
}

function createDefaultFormModel(): FormModel {
  return {
    time: 0,
    name: '',
    deviceList: []
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
  await checkDeviceList();
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
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-1200px">
    <NForm ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <NGrid :cols="24" :x-gap="18">
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.planName')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-200px" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.rotation.waterPumpEquipment')" path="name">
          <NSelect v-model:value="formModel.name" class="important-w-200px" clearable :options="[]" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.rotation.waterPumpDoorOpening')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-200px" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.rotation.waterPumpPressure')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-200px" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.rotation.rotationDuration')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-100px" />
          <label class="ml-10px mr-20px text-nowrap">{{ $t('page.irrigation.hour') }}</label>
          <NInput v-model:value="formModel.name" class="important-w-100px" />
          <label class="ml-10px text-nowrap">{{ $t('page.irrigation.minute') }}</label>
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.group.startTime')" path="name">
          <NDatePicker v-model:value="formModel.time" type="datetime" clearable />
        </NFormItemGridItem>
      </NGrid>
      <div class="flex flex-justify-right">
        <NButton class="w-120px" @click="openDevicesModalFn">
          {{ $t('page.irrigation.rotation.addRotationDevice') }}
        </NButton>
      </div>
      <NDivider></NDivider>
      <NFlex justify="space-between">
        <NFlex class="w-140px">
          <div>空间区域</div>
          <div>序号1</div>
        </NFlex>
        <n-input-group class="w-200px">
          <n-input-group-label>{{ $t('page.irrigation.rotation.valveStatus') }}</n-input-group-label>
          <n-input />
        </n-input-group>
        <n-input-group class="w-350px">
          <n-input-group-label>{{ $t('page.irrigation.rotation.rotationDuration') }}</n-input-group-label>
          <n-input />
          <n-input-group-label>{{ $t('page.irrigation.hour') }}</n-input-group-label>
          <n-input />
          <n-input-group-label>{{ $t('page.irrigation.minute') }}</n-input-group-label>
        </n-input-group>
        <n-input-group class="w-200px">
          <n-input-group-label>{{ $t('page.irrigation.rotation.pressure') }}</n-input-group-label>
          <n-input />
          <n-input-group-label>Mpa</n-input-group-label>
        </n-input-group>
        <NButton class="w-72px" @click="closeModal">{{ $t('common.delete') }}</NButton>
      </NFlex>
      <NSpace class="w-full pt-16px" :size="24" justify="end">
        <NButton class="w-72px" @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton class="w-72px" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </NForm>
    <DevicesModal v-model:visible="devicesVisible" :type="modalType" :edit-data="editData" @success="handleSubmit" />
  </NModal>
</template>

<style scoped></style>
