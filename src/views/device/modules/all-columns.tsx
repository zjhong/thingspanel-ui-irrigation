import {type DataTableColumns, NButton, NFlex, NPopconfirm} from 'naive-ui';
import dayjs from 'dayjs';
import {$t} from "@/locales";
import {useAppStore} from "@/store/modules/app";


const appS = useAppStore()

console.log(appS.locale, "5430954392504")
export const group_columns = (viewDetails: (rid: string) => void, deleteItem: (rid: string) => void) => [
  {
    title: () => $t('custom.groupPage.groupName'),
    key: 'name',
    ellipsis: {
      tooltip: {
        width: 320
      }
    }
  },
  {
    title: () => $t('custom.groupPage.description'),
    key: 'description',
    ellipsis: {
      tooltip: {
        width: 320
      }
    }
  },
  {
    title: () => $t('custom.groupPage.createdAt'),
    key: 'created_at',
    render(row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: () => $t('custom.groupPage.actions'),
    key: 'actions',
    width: 190,
    render: (row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) => {
      return (
        <div onClick={(e) => {
          e.stopPropagation();
        }
        }>
          <NFlex justify={'start'}>
            <NButton
              quaternary type="primary"
              size={'small'}
              onClick={() => {
                viewDetails(row.id);
              }}
            >
              {$t('custom.groupPage.view')}
            </NButton>
            <NPopconfirm
              onPositiveClick={(e) => {
                e.stopPropagation();
                deleteItem(row.id);
              }}
            >
              {{
                default: () => $t('custom.groupPage.confirmDelete'),
                trigger: () => <NButton quaternary type="primary"
                                        size={'small'}>{$t('custom.groupPage.delete')}</NButton>
              }}
            </NPopconfirm>
          </NFlex>
        </div>
      );
    }
  }
];

export const createDeviceColumns = (): DataTableColumns<DeviceManagement.DeviceData> => [
  {
    type: 'selection'
  },
  {
    title: () => $t('custom.devicePage.deviceName'),
    key: 'name',
    render: row => row.name || '-'
  },
  {
    title: () => $t('custom.devicePage.deviceNumber'),
    key: 'device_number',
    render: row => row.device_number || '-'
  },
  {
    title: () => $t('custom.devicePage.deviceConfig'),
    key: 'device_config_name',
  }
];

export const createNoSelectDeviceColumns = (
  viewDevicsseDetails: (rid: string) => void,
  deleteDeviceItem: (rid: string) => void
): DataTableColumns<DeviceManagement.DeviceData> => {
  return [
    {
      title: () => $t('custom.devicePage.deviceName'),
      key: 'name',
      render: row => row.name || '-'
    },
    {
      title: () => $t('custom.devicePage.deviceNumber'),
      key: 'device_number',
      render: row => row.device_number || '-'
    },
    {
      title: () => $t('custom.devicePage.deviceConfig'),
      key: 'device_config_name',
    },
    {
      title: () => $t('custom.groupPage.actions'),
      key: 'actions',
      width: 250,
      render: row => {
        return (
          <NFlex justify={'start'}>
            <NButton
              quaternary
              type="primary"
              size={'small'}
              onClick={() => {
                viewDevicsseDetails(row.id);
              }}
            >
              {$t('custom.groupPage.view')}
            </NButton>
            <NPopconfirm
              onPositiveClick={() => {
                deleteDeviceItem(row.id);
              }}
            >
              {{
                default: () => $t('custom.groupPage.confirmDelete'),
                trigger: () => <NButton quaternary
                                        type="primary" size={'small'}>{$t('custom.groupPage.removeFromGroup')}</NButton>
              }}
            </NPopconfirm>
          </NFlex>
        );
      }
    }
  ];
};
