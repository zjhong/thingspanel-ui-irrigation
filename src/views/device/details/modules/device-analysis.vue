<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
import { addChildDevice, childDeviceSelectList, deviceUpdate, removeChildDevice } from '@/service/api/device';

const props = defineProps<{
  id: string;
}>();

const showAddDialog = ref(false);
const showSetDialog = ref(false);
const showDeleteDialog = ref(false);
const deviceSetName = ref();
const deviceSetId = ref();

const tableData = ref([]);
const childTableData = ref([]);
// const options = ref<string[]>(['查看','设置子设备地址','删除'])
const total = ref(0);
const log_page = ref(1);
const selectChild = ref<string[]>([]);
const columns = ref([
  {
    title: '设备名称',
    key: 'name'
  },
  {
    title: '子设备地址',
    key: 'subDeviceAddr'
  },
  {
    title: '操作',
    key: ''
    // render (row) {
    //   const tags = options.value.map((tagKey, index) => {
    //       return h(
    //         NButton,{
    //            style: {
    //               marginRight:'10px'
    //            },
    //            onClick: () => clickItem(index, row)
    //         },
    //         {
    //            default: ()=> tagKey
    //         }

    //       )
    //   })
    //   return tags

    // }
  }
]);

// const clickItem = (index, row) => {
//    console.log(index)
//    console.log(row)
//    if(index === 0){

//    }else if(index === 1){

//      showSetDialog.value = true
//      deviceSetId.value = row.id
//    }else {
//      showDeleteDialog.value = true
//      deviceSetId.value = row.id
//    }
// };

const addSure = async () => {
  if (selectChild.value.length === 0) {
    window.$message?.error('请先选择子设备');
    return;
  }
  console.log(selectChild.value.join(','));

  const res = await addChildDevice({
    id: props.id,
    son_id: selectChild.value.join(',')
  });
  showAddDialog.value = false;
  // getData()
  console.log(res);
};
const setSure = async () => {
  console.log(deviceSetName.value);
  if (!deviceSetName.value) {
    window.$message?.error('请先输入子设备地址');
    return;
  }
  const res = await deviceUpdate({
    id: deviceSetId.value,
    parent_id: '57',
    sub_device_addr: deviceSetName.value
  });
  if (res) {
    showSetDialog.value = false;
    log_page.value = 1;
    // getData()
  }
};
const getDeviceList = async () => {
  const res = await childDeviceSelectList();
  if (res.data.length !== 0) {
    // for(var i=0;i < 4;i++){
    //   res.data.push({name:'AAAA'+i,device_config_id:i})
    // }
    childTableData.value = res.data;
  }
};

const addDevice = () => {
  showAddDialog.value = true;
  getDeviceList();
};

const deleteSure = async () => {
  const res = await removeChildDevice({
    sub_device_id: deviceSetId.value
  });
  if (res) {
    showDeleteDialog.value = false;
    log_page.value = 1;
    // getData()
  }
};

// const getData = async() => {
//    console.log(props.id)
//    const res = await childDeviceTableList({
//     page: log_page.value,
//     page_size: 5,
//     id: props.id,

//   });
//   console.log(res.data.list)
//     if(res.data.list !== null){
//        tableData.value = tableData.value.concat(res.data.list);
//     }
// };
// const renderMultipleSelectTag: SelectRenderTag = (option: any) => {
//  return h(
//         'div',
//         {
//           style: {
//             display: 'flex',
//             alignItems: 'center'
//           }
//         },
//         [

//          h("div", null, option.name),
//         ]
//       )
// };
// const renderLabel = (option: any) => {
//     return h(
//         "div",
//         {
//           style: {
//             display: "flex",
//             alignItems: "center"
//           }
//         },
//         [
//           h("div", {
//             style: {
//               width:'100px'
//             }
//           }, [option.name]),
//           h(
//             "div",
//             {
//               style: {
//                 marginLeft: "12px",
//                 padding: "4px 0"
//               }
//             },
//             [
//            //   h("div", null, [option.device_config_name]),

//             ]
//           )
//         ]
//       );

// };
// getData()
onMounted(() => {});
</script>

<template>
  <n-card class="w-full">
    <NButton type="primary" @click="addDevice">添加子设备</NButton>
    <n-modal v-model:show="showAddDialog" title="下发属性" style="height: 300px" class="w-[400px]">
      <n-card>
        <n-form>
          <n-form-item label="添加子设备">
            <n-select
              v-model:value="selectChild"
              :options="childTableData"
              label-field="name"
              value-field="device_config_id"
              filterable
              multiple
            >
              <template #header>设备名称</template>
            </n-select>
          </n-form-item>
          <n-space style="display: flex; justify-content: flex-end; margin-top: 140px">
            <NButton @click="showAddDialog = false">取消</NButton>
            <NButton @click="addSure">确定</NButton>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showSetDialog" title="下发属性" class="w-[400px]">
      <n-card>
        <n-form>
          <n-form-item label="子设备地址设置">
            <n-input v-model:value="deviceSetName" type="text" placeholder="请输入子设备地址" />
          </n-form-item>
          <n-space style="display: flex; justify-content: flex-end">
            <NButton @click="showSetDialog = false">取消</NButton>
            <NButton @click="setSure">确定</NButton>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showDeleteDialog" title="下发属性" class="w-[400px]">
      <n-card>
        <n-form>
          <n-form-item label="温馨提示">
            <sapn>确定要删除设备？</sapn>
          </n-form-item>
          <n-space style="display: flex; justify-content: flex-end">
            <NButton @click="showDeleteDialog = false">取消</NButton>
            <NButton @click="deleteSure">确定</NButton>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
    <n-data-table :columns="columns" :data="tableData" class="mt-4" />
    <div class="mt-4 w-full flex justify-end">
      <n-pagination
        :page-count="total"
        :page-size="5"
        @update:page="
          page => {
            log_page = page;
            log_page = page;
            //getData();
          }
        "
      />
    </div>
  </n-card>
</template>

<style scoped></style>
