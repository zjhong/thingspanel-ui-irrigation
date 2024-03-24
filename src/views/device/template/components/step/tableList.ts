import { ref, Ref } from "vue";
import type { DataTableColumns } from "naive-ui";

export const test: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: "data_name",
    title: "数据名称",
    align: "center",
  },
  {
    key: "data_identifier",
    title: "数据标识符",
    align: "center",
  },
  {
    key: "data_type",
    title: "读写标志",
    align: "center",
  },
  {
    key: "read_write_flag",
    title: "数据类型",
    align: "center",
  },
  {
    key: "unit",
    title: "单位",
    align: "center",
  },
  {
    key: "description",
    title: "描述",
    align: "center",
  },
]);

export const attribute: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: "data_name",
    title: "属性名称",
    align: "center",
  },
  {
    key: "data_identifier",
    title: "属性标识符",
    align: "center",
  },
  {
    key: "data_type",
    title: "读写标志",
    align: "center",
  },
  {
    key: "read_write_flag",
    title: "数据类型",
    align: "center",
  },
  {
    key: "unit",
    title: "单位",
    align: "center",
  },
  {
    key: "description",
    title: "描述",
    align: "center",
  },
]);

export const events: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: "data_name",
    title: "事件名称",
    align: "center",
  },
  {
    key: "data_identifier",
    title: "事件标识符",
    align: "center",
  },
  {
    key: "data_type",
    title: "事件参数",
    align: "center",
  },
  {
    key: "description",
    title: "描述",
    align: "center",
  },
]);

export const command: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: "data_name",
    title: "命令名称",
    align: "center",
  },
  {
    key: "data_identifier",
    title: "命令标识符",
    align: "center",
  },
  {
    key: "data_type",
    title: "命令参数",
    align: "center",
  },
  {
    key: "description",
    title: "描述",
    align: "center",
  },
]);
