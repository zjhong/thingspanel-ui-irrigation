<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { FormInst } from 'naive-ui';
import { NButton, NCard, useDialog, useMessage } from 'naive-ui';
import moment from 'moment';
import EditAction from '@/views/automation/linkage-edit/modules/edit-action.vue';
import EditPremise from '@/views/automation/linkage-edit/modules/edit-premise.vue';
import { sceneAutomationsAdd, sceneAutomationsEdit, sceneAutomationsInfo } from '@/service/api/automation';
import { useRouterPush } from '@/hooks/common/router';
const { routerBack } = useRouterPush();

const dialog = useDialog();
const message = useMessage();
const route = useRoute();
const configFormRules = ref({
  name: {
    required: true,
    message: '请输入场景联动名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入场景联动描述',
    trigger: 'blur'
  }
});
const configFormRef = ref<HTMLElement & FormInst>();
const configForm = ref(defaultConfigForm());
const configId = ref(route.query.id || '');
function defaultConfigForm() {
  return {
    id: '',
    name: null,
    description: null,
    enabled: 'Y',
    trigger_condition_groups: [],
    actions: []
  };
}
const editPremise = ref();
const editAction = ref();
const submitData = async () => {
  // 处理条件的数据
  const TriggerConditionData = JSON.parse(JSON.stringify(editPremise.value.ifGroupsData()));
  // eslint-disable-next-line array-callback-return
  TriggerConditionData.map((ifGroupItem: any) => {
    // eslint-disable-next-line array-callback-return
    ifGroupItem.map((ifItem: any) => {
      // ifItem.expiration_time = moment().format();
      if (ifItem.trigger_conditions_type === '10' || ifItem.trigger_conditions_type === '11') {
        if (ifItem.trigger_operator === 'between') {
          ifItem.trigger_value = `${ifItem.minValue}-${ifItem.maxValue}`;
        }
      }
      if (ifItem.trigger_conditions_type === '22') {
        let trigger_value = '';
        // eslint-disable-next-line array-callback-return
        ifItem.weekChoseValue.map((item: any) => {
          trigger_value += item;
        });
        console.log(ifItem.startTimeValue);
        console.log(ifItem.endTimeValue);
        console.log(moment(ifItem.startTimeValue).format('yyyy-MM-DD HH:mm:ss'));
        trigger_value += `|${moment(ifItem.startTimeValue).format('HH:mm:ssZ')}`;
        trigger_value += `|${moment(ifItem.endTimeValue).format('HH:mm:ssZ')}`;
        ifItem.trigger_value = trigger_value;
      }
      if (ifItem.trigger_conditions_type === '20') {
        ifItem.execution_time = moment(ifItem.onceTimeValue).format();
      }
      if (ifItem.trigger_conditions_type === '21') {
        if (ifItem.task_type === 'HOUR') {
          ifItem.params = moment(ifItem.hourTimeValue).format('mm:00Z');
        }
        if (ifItem.task_type === 'DAY') {
          ifItem.params = moment(ifItem.dayTimeValue).format('HH:mm:00Z');
        }
        if (ifItem.task_type === 'WEEK') {
          let params = '';
          // eslint-disable-next-line array-callback-return
          ifItem.weekChoseValue.map((item: any) => {
            params += item;
          });
          ifItem.params = `${params}|${moment(ifItem.weekTimeValue).format('HH:mm:00Z')}`;
        }
        if (ifItem.task_type === 'MONTH') {
          ifItem.params = `${ifItem.monthChoseValue}T${moment(ifItem.monthTimeValue).format(`HH:mm:00Z`)}`;
        }
      }
    });
  });
  configForm.value.trigger_condition_groups = TriggerConditionData;
  // 处理动作的数据
  const actionGroupsData = JSON.parse(JSON.stringify(editAction.value.actionGroupsReturn()));
  const actionsData = [] as any;
  // eslint-disable-next-line array-callback-return
  actionGroupsData.map((item: any) => {
    if (item.actionType === '1') {
      // eslint-disable-next-line array-callback-return
      item.actionInstructList.map((instructItem: any) => {
        actionsData.push(instructItem);
      });
    } else {
      item.action_type = item.actionType;
      actionsData.push(item);
    }
  });
  configForm.value.actions = actionsData;
  await configFormRef?.value?.validate();
  dialog.warning({
    title: '提示',
    content: '请确认是否保存该场景信息？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      if (configId.value) {
        const res = await sceneAutomationsEdit(configForm.value);
        if (!res.error) {
          message.success('编辑成功');
          routerBack();
        }
      } else {
        const res = await sceneAutomationsAdd(configForm.value);
        if (!res.error) {
          message.success('新增成功');
          routerBack();
        }
      }
    }
  });
};

const conditionsType = ref(null as any);
const conditionChose = data => {
  if (data) {
    conditionsType.value = data;
  }
};
const automationsInfo = ref(null as any);
const getSceneAutomationsInfo = async () => {
  const res = await sceneAutomationsInfo(configId.value);
  if (res.data) {
    automationsInfo.value = res.data;
    configForm.value = res.data;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    echoData();
  }
};
const conditionData = ref([] as any);
const echoData = () => {
  // eslint-disable-next-line array-callback-return
  automationsInfo.value.trigger_condition_groups.map((citem: any) => {
    console.log(citem);
    // eslint-disable-next-line array-callback-return
    citem.map((ifItem: any) => {
      if (ifItem.trigger_conditions_type === '10' || ifItem.trigger_conditions_type === '11') {
        ifItem.ifType = '1';
        if (ifItem.trigger_operator === 'between') {
          ifItem.minValue = ifItem.trigger_value.split('-')[0];
          ifItem.maxValue = ifItem.trigger_value.split('-')[1];
        }
      }
      if (ifItem.trigger_conditions_type === '22') {
        ifItem.ifType = '2';
        const weekChoseValue = ifItem.trigger_value.split('|')[0];
        ifItem.weekChoseValue = weekChoseValue.split('');
        const startTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${ifItem.trigger_value.split('|')[1]}`;
        const endTimeValue = `${String(moment().format('yyyy-MM-DD'))} ${ifItem.trigger_value.split('|')[2]}`;
        ifItem.startTimeValue = moment(startTimeValue).valueOf();
        ifItem.endTimeValue = moment(endTimeValue).valueOf();
      }
      if (ifItem.trigger_conditions_type === 'once') {
        ifItem.ifType = '2';
        ifItem.onceTimeValue = moment(ifItem.execution_time).valueOf();
      }
      if (ifItem.trigger_conditions_type === 'repeat') {
        //   if (ifItem.task_type === 'HOUR') {
        //     ifItem.params = moment(ifItem.hourTimeValue).format('mm:00Z');
        //     console.log(ifItem.params);
        //   }
        //   if (ifItem.task_type === 'DAY') {
        //     ifItem.params = moment(ifItem.dayTimeValue).format('HH:mm:00Z');
        //   }
        //   if (ifItem.task_type === 'WEEK') {
        //     let params = '';
        //     // eslint-disable-next-line array-callback-return
        //     ifItem.weekChoseValue.map((item: any) => {
        //       params += item;
        //     });
        //     ifItem.params = `${params}|${moment(ifItem.weekTimeValue).format('HH:mm:00Z')}`;
        //   }
        //   if (ifItem.task_type === 'MONTH') {
        //     ifItem.params = `${ifItem.monthChoseValue}T${moment(ifItem.monthTimeValue).format(`HH:mm:00Z`)}`;
        //   }
      }
    });
  });
  conditionData.value = automationsInfo.value.trigger_condition_groups;
};
onMounted(() => {
  if (configId.value) {
    // eslint-disable-next-line no-unused-expressions
    typeof configId.value === 'string' ? (configForm.value.id = configId.value) : '';
    getSceneAutomationsInfo();
  }
});
</script>

<template>
  <div class="linkage-edit">
    <NCard :bordered="false" :title="`${configId ? '编辑' : '新增'}场景联动`">
      <NForm
        ref="configFormRef"
        :model="configForm"
        :rules="configFormRules"
        label-placement="left"
        label-width="150"
        size="small"
      >
        <NFlex>
          <NFormItem label="场景联动名称" path="name" class="w-150">
            <NInput v-model:value="configForm.name" placeholder="请输入场景联动名称" />
          </NFormItem>
          <NFormItem label="描述" path="description" class="w-150">
            <NInput v-model:value="configForm.description" type="textarea" placeholder="请输入描述" rows="1" />
          </NFormItem>
        </NFlex>
        <NFormItem label="如果:" class="w-100%">
          <EditPremise ref="editPremise" :condition-data="conditionData" @condition-chose="conditionChose" />
        </NFormItem>
        <NFormItem label=" ">
          <n-divider dashed class="divider-class" />
        </NFormItem>
        <NFormItem label="那么:" class="w-100%">
          <EditAction ref="editAction" :conditions-type="conditionsType" />
        </NFormItem>
      </NForm>
      <n-divider class="divider-class" />
      <NFlex justify="center" class="mt-5">
        <NButton type="primary" @click="submitData">保存</NButton>
      </NFlex>
    </NCard>
  </div>
</template>

<style scoped>
.divider-class {
  margin: 0;
}
</style>
