<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-17 13:31:30
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-20 19:43:18
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { addWarningMessage, editInfo } from '@/service/api/alarm';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
// interface ColumnsData {
//   [key: string]: any;
// }
export interface Props {
  visible: boolean;
  type?: 'add' | 'edit';
  editData: any;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'PopUp' });
const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '新增告警',
    edit: '编辑告警'
  };
  return titles[props.type];
});

console.log('props.type88888888', title);

interface Emits {
  (e: 'update:visible', visible: boolean): void;

  (e: 'newEdit'): void;
}

const message = useMessage();
const emit = defineEmits<Emits>();
const { formRef } = useNaiveForm();
const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const generalOptions = ref([]);
const alarmRepeatTime = ref([
  {
    label: '1次',
    value: '1'
  },
  {
    label: '2次',
    value: '2'
  },
  {
    label: '3次',
    value: '3'
  },
  {
    label: '4次',
    value: '4'
  },
  {
    label: '5次',
    value: '5'
  },
  {
    label: '6次',
    value: '6'
  },
  {
    label: '7次',
    value: '7'
  },
  {
    label: '8次',
    value: '8'
  },
  {
    label: '9次',
    value: '9'
  },
  {
    label: '10次',
    value: '10'
  }
]);
const alarmLevel = ref([
  {
    label: '高',
    value: 'H'
  },
  {
    label: '中',
    value: 'M'
  },
  {
    label: '低',
    value: 'L'
  }
]);
/** 触发时间下拉 */
const alarmKeepTime = ref([
  {
    label: '1分钟',
    value: '1'
  },
  {
    label: '2分钟',
    value: '2'
  },
  {
    label: '3分钟',
    value: '3'
  },
  {
    label: '4分钟',
    value: '4'
  },
  {
    label: '5分钟',
    value: '5'
  },
  {
    label: '6分钟',
    value: '6'
  },
  {
    label: '7分钟',
    value: '7'
  },
  {
    label: '8分钟',
    value: '8'
  },
  {
    label: '9分钟',
    value: '9'
  },
  {
    label: '10分钟',
    value: '10'
  }
]);
/** 关闭弹框 */
const closeModal = () => {
  modalVisible.value = false;
  emit('newEdit');
};

const formData = ref({
  id: '',
  name: '',
  alarm_level: '',
  alarm_repeat_time: '', // 触发重复次数
  alarm_keep_time: '', // 触发持续时间
  notification_group_id: '', // 通知组ID
  enabled: 'Y', // 是否启用，Y-启用N-停止
  description: ''
});
const rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入告警名称'
  },
  alarm_level: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入告警级别'
  },
  alarm_repeat_time: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入触发重复次数'
  },
  alarm_keep_time: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入触发持续时间'
  }
};
/** 新增 */
const add = async () => {
  const data = {
    name: formData.value.name,
    alarm_level: formData.value.alarm_level,
    alarm_repeat_time: Number(formData.value.alarm_repeat_time),
    alarm_keep_time: Number(formData.value.alarm_keep_time),
    notification_group_id: formData.value.notification_group_id,
    enabled: 'Y',
    description: formData.value.description
  };
  const res = await addWarningMessage(data);
  if (res) {
    message.success('添加成功');
    modalVisible.value = false;
    emit('newEdit');
  } else {
    message.error('添加失败');
  }
};

/** @param e 编辑 */
async function editInfoText() {
  const datas = {
    id: formData.value.id,
    name: formData.value.name,
    alarm_level: formData.value.alarm_level,
    alarm_repeat_time: Number(formData.value.alarm_repeat_time),
    alarm_keep_time: Number(formData.value.alarm_keep_time),
    notification_group_id: formData.value.notification_group_id,
    enabled: 'Y',
    description: formData.value.description
  };
  const { data } = await editInfo(datas);
  if (data) {
    message.success('编辑成功');
    modalVisible.value = false;
    emit('newEdit');
  } else {
    message.success('编辑失败');
  }
}

function handleReset(e) {
  Object.assign(formData, {
    id: '',
    name: '',
    alarm_level: '',
    alarm_repeat_time: '',
    alarm_keep_time: '',
    notification_group_id: '',
    enabled: 'Y',
    description: ''
  });
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (!errors) {
      if (props.type === 'add') {
        add();
      } else {
        editInfoText();
      }
    } else {
      console.log('验证失败');
    }
  });
}

watch(props, newValue => {
  console.log('newValue', newValue);
  if (props.type === 'edit') {
    formData.value = props.editData;
    formData.value.alarm_keep_time = String(formData.value.alarm_keep_time);
    formData.value.alarm_repeat_time = String(formData.value.alarm_repeat_time);
  } else {
    formData.value = {
      id: '',
      name: '',
      alarm_level: '',
      alarm_repeat_time: '',
      alarm_keep_time: '',
      notification_group_id: '',
      enabled: 'Y',
      description: ''
    };
  }
});
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title">
    <NForm ref="formRef" label-placement="top" :rules="rules" :model="formData">
      <n-form-item :label="$t('generate.alarm-name')" path="name">
        <n-input v-model:value="formData.name" :placeholder="$t('generate.alarm-name')" />
      </n-form-item>

      <n-form-item :label="$t('generate.alarm-description')">
        <n-input v-model:value="formData.description" :placeholder="$t('generate.alarm-description')" />
      </n-form-item>

      <n-form-item :label="$t('generate.alarm-level')" path="alarm_level">
        <n-select
          v-model:value="formData.alarm_level"
          :placeholder="$t('generate.alarm-level')"
          :options="alarmLevel"
        />
      </n-form-item>

      <n-form-item :label="$t('generate.trigger-repeat-count')" path="alarm_repeat_time">
        <n-select
          v-model:value="formData.alarm_repeat_time"
          :placeholder="$t('generate.trigger-repeat-count')"
          :options="alarmRepeatTime"
        />
      </n-form-item>

      <n-form-item :label="$t('generate.trigger-duration')" path="alarm_keep_time">
        <n-select
          v-model:value="formData.alarm_keep_time"
          :placeholder="$t('generate.trigger-duration')"
          :options="alarmKeepTime"
        />
      </n-form-item>

      <n-form-item :label="$t('generate.notification-group')" path="selectValue">
        <n-select
          v-model:value="formData.notification_group_id"
          :placeholder="$t('generate.select-notification-group')"
          :options="generalOptions"
        />
      </n-form-item>

      <NSpace class="w-full pt-16px" :size="24" justify="end">
        <NButton class="w-72px" @click="closeModal">{{ $t('generate.cancel') }}</NButton>
        <NButton class="w-72px" type="primary" @click="handleReset">{{ $t('common.save') }}</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
