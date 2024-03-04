import dayjs from 'dayjs';
import { NButton, NFlex, NPopconfirm } from 'naive-ui';

export const group_columns = (viewDetails: (rid: string) => void, deleteItem: (rid: string) => void) => [
  {
    title: '分组名称',
    key: 'name',
    ellipsis: {
      tooltip: {
        width: 320
      }
    }
  },
  {
    title: '描述',
    key: 'description',
    ellipsis: {
      tooltip: {
        width: 320
      }
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    render(row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row: { id: string; name: string; description: string; created_at: string; [key: string]: any }) => {
      return (
        <NFlex justify={'start'}>
          <NButton
            size={'small'}
            onClick={() => {
              viewDetails(row.id);
            }}
          >
            查看
          </NButton>
          <NPopconfirm
            onPositiveClick={() => {
              deleteItem(row.id);
            }}
          >
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NFlex>
      );
    }
  }
];
