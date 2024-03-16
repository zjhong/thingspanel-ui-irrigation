<script setup lang="tsx">
import { computed, reactive, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import type { FormInst, FormItemRule } from 'naive-ui';
// import { genderOptions } from '@/constants'
import { addUser, editUser } from '@/service/api/auth';
import { createRequiredFormRule } from '@/utils/form/rule';
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
// const modalType = ref<ModalType>('add');
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
    add: $t('page.irrigation.addIrrigationPlan'),
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
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-800px">
    <NForm ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <NGrid :cols="24" :x-gap="18">
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.time.planName')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-200px" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.areaOrSpace')" path="name">
          <NSelect v-model:value="formModel.name" class="w-200px" clearable :options="[]" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.time.device')" path="name">
          <NSelect v-model:value="formModel.name" class="w-200px" clearable :options="[]" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.time.irrigationTime')" path="name">
          <n-time-picker default-formatted-value="00:12:13" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.time.repeatTime')" path="name">
          <n-checkbox-group v-model:value="formModel.deviceList">
            <n-space item-style="display: flex;">
              <n-checkbox value="Beijing1" :label="$t('page.irrigation.time.week.monday')" />
              <n-checkbox value="Beijing2" :label="$t('page.irrigation.time.week.tuesday')" />
              <n-checkbox value="Beijing3" :label="$t('page.irrigation.time.week.wednesday')" />
              <n-checkbox value="Beijing4" :label="$t('page.irrigation.time.week.thursday')" />
              <n-checkbox value="Beijing5" :label="$t('page.irrigation.time.week.friday')" />
              <n-checkbox value="Beijing6" :label="$t('page.irrigation.time.week.saturday')" />
              <n-checkbox value="Beijing7" :label="$t('page.irrigation.time.week.sunday')" />
            </n-space>
          </n-checkbox-group>
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.controlType')" path="name">
          <n-radio-group v-model:value="formModel.name" name="radiogroup">
            <n-space>
              <n-radio value="song.value">{{ $t('page.irrigation.duration') }}</n-radio>
              <n-radio value="song.value2">{{ $t('page.irrigation.capacity') }}</n-radio>
            </n-space>
          </n-radio-group>
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.irrigationDuration')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-100px" />
          <label class="ml-10px mr-20px text-nowrap">{{ $t('page.irrigation.hour') }}</label>
          <NInput v-model:value="formModel.name" class="important-w-100px" />
          <label class="ml-10px text-nowrap">{{ $t('page.irrigation.minute') }}</label>
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.capacity')" path="name">
          <NInput v-model:value="formModel.name" class="important-w-200px" />
        </NFormItemGridItem>
        <NFormItemGridItem :span="24" :label="$t('page.irrigation.time.doorOpeing')" path="name">
          <NSelect v-model:value="formModel.name" class="w-200px" clearable :options="[]" />
        </NFormItemGridItem>
      </NGrid>
      <NSpace class="w-full pt-16px" :size="24" justify="end">
        <NButton class="w-72px" @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton class="w-72px" type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
