import type { Ref } from 'vue';
import { ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { $t } from '@/locales';

export const test: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: 'data_name',
    title: $t('device_template.table_header.dataName'),
    align: 'center'
  },
  {
    key: 'data_identifier',
    title: $t('device_template.table_header.dataIdentifier'),
    align: 'center'
  },
  {
    key: 'data_type',
    title: $t('device_template.table_header.readAndWriteSign'),
    align: 'center'
  },
  {
    key: 'read_write_flag',
    title: $t('device_template.table_header.dataType'),
    align: 'center'
  },
  {
    key: 'unit',
    title: $t('device_template.table_header.unit'),
    align: 'center'
  },
  {
    key: 'description',
    title: $t('device_template.table_header.description'),
    align: 'center'
  }
]);

export const attribute: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: 'data_name',
    title: $t('device_template.table_header.attributeName'),
    align: 'center'
  },
  {
    key: 'data_identifier',
    title: $t('device_template.table_header.attributeIdentifier'),
    align: 'center'
  },
  {
    key: 'data_type',
    title: $t('device_template.table_header.readAndWriteSign'),
    align: 'center'
  },
  {
    key: 'read_write_flag',
    title: $t('device_template.table_header.dataType'),
    align: 'center'
  },
  {
    key: 'unit',
    title: $t('device_template.table_header.unit'),
    align: 'center'
  },
  {
    key: 'description',
    title: $t('device_template.table_header.description'),
    align: 'center'
  }
]);

export const events: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: 'data_name',
    title: $t('device_template.table_header.eventName'),
    align: 'center'
  },
  {
    key: 'data_identifier',
    title: $t('device_template.table_header.eventIdentifier'),
    align: 'center'
  },
  {
    key: 'data_type',
    title: $t('device_template.table_header.eventParameters'),
    align: 'center'
  },
  {
    key: 'description',
    title: $t('device_template.table_header.description'),
    align: 'center'
  }
]);

export const command: Ref<DataTableColumns<AddDeviceModel.Device>> = ref([
  {
    key: 'data_name',
    title: $t('device_template.table_header.commandName'),
    align: 'center'
  },
  {
    key: 'data_identifier',
    title: $t('device_template.table_header.commandIdentifier'),
    align: 'center'
  },
  {
    key: 'data_type',
    title: $t('device_template.table_header.commandParameters'),
    align: 'center'
  },
  {
    key: 'description',
    title: $t('device_template.table_header.description'),
    align: 'center'
  }
]);
