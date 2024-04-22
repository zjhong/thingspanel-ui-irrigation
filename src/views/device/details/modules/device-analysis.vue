<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
// import { childDeviceTableList } from '@/service/api/device';
import { deviceUpdate, removeChildDevice } from '@/service/api';

// defineProps<{
//   id: string;
// }>();

const showAddDialog = ref(false);
const showSetDialog = ref(false);
const showDeleteDialog = ref(false);
// const deviceSelectName = ref();
const deviceSetName = ref();
const deviceSetId = ref();

// const tableData = ref([]);
// const options = ref<string[]>(['查看','设置子设备地址','删除'])
const total = ref(0);
const log_page = ref(1);
// const columns =ref([
//     {
//       title: '设备名称',
//       key: 'name'
//     },
//     {
//       title: '子设备地址',
//       key: 'subDeviceAddr'
//     },
//     {
//       title: '操作',
//       render (row) {
//         const tags = options.value.map((tagKey, index) => {
//             return h(
//               NButton,{
//                  style: {
//                     marginRight:'10px'
//                  },
//                  onClick: () => clickItem(index, row)
//               },
//               {
//                  default: ()=> tagKey
//               }

//             )
//         })
//         return tags

//       }
//     }],
// );

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

const addDevice = () => {
  showAddDialog.value = true;
  // getDeviceList()
};
const addSure = () => {
  // console.log(deviceSelectName)
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
// const getDeviceList = async () =>{
//   const res = await childDeviceSelectList();
//   console.log(res)
// };

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
//     id: '57',

//   });
//     if(res.data){
//       // tableData.value = tableData.value.concat(res.data.list);
//     }
// };
onMounted(async () => {
  // await getData()
});
</script>

<template>
  <n-card class="w-full">
    <NButton type="primary" @click="addDevice">添加子设备</NButton>
    <n-modal v-model:show="showAddDialog" title="下发属性" style="height: 300px" class="w-[400px]">
      <n-card>
        <n-form>
          <n-form-item label="添加子设备">
            <!-- <n-select v-model:value="deviceSelectName" :options="options"/> -->
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
    <!-- <n-data-table :columns="columns" :data="tableData"  class="mt-4" /> -->
    <div class="mt-4 w-full flex justify-end">
      <n-pagination
        :page-count="total"
        :page-size="5"
        @update:page="
          page => {
            // log_page = page;
            log_page = page;
            //getData();
          }
        "
      />
    </div>
  </n-card>
</template>

<style scoped></style>
