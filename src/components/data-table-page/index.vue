<script lang="tsx" setup>
import { computed, ref, watchEffect } from 'vue';
import { NButton, NDataTable, NInput, NSpace } from 'naive-ui';

export type SearchConfig =
  | {
      key: string;
      label: string;
      type: 'input' | 'date'; // 'input' 和 'date' 类型没有 options
    }
  | {
      key: string;
      label: string;
      type: 'select'; // 'select' 类型需要有 options
      options: { label: string; value: any }[];
    }
  | {
      key: string;
      label: string;
      type: 'date-range'; // 'date-range' 类型没有 options
    };
// 定义Props类型，包括数据获取函数、列显示配置和表格操作配置
const props = defineProps<{
  fetch_data: (data: any) => Promise<any>;
  columnsToShow: string[] | 'all';
  // eslint-disable-next-line vue/prop-name-casing
  table_actions: Array<{
    label: string;
    callback: (row: any) => void;
  }>;
  searchConfigs: SearchConfig[];
}>();

const { fetch_data, columnsToShow, table_actions, searchConfigs } = props;

// 组件状态：数据列表、总数、当前页、页面大小
const dataList = ref<any[]>([]);
const total = ref(0);
const the_page = ref(1);
const the_pageSize = ref(10);

// 搜索条件状态
const searchCriteria = ref({});

// 获取数据函数，包含分页和搜索逻辑
const getData = async () => {
  // 模拟搜索条件处理，这里只是一个基础示例
  const processedSearchCriteria = {};
  Object.keys(searchCriteria).forEach(key => {
    const value = searchCriteria[key];
    if (value) {
      if (key === 'dateRange') {
        // 处理日期范围条件，确保其格式适合您的后端或模拟函数
        processedSearchCriteria[key] = [value[0]?.toISOString(), value[1]?.toISOString()];
      } else if (key === 'registrationDate') {
        // 单个日期的处理
        processedSearchCriteria[key] = value?.toISOString();
      } else {
        // 其他类型的条件可以直接使用
        processedSearchCriteria[key] = value;
      }
    }
  });
  console.log(processedSearchCriteria, '232432');
  // 使用调整后的搜索条件调用fetch_data
  const { data, error } = await fetch_data({
    page: the_page.value,
    page_size: the_pageSize.value,
    ...processedSearchCriteria
  });

  if (!error) {
    dataList.value = data.list;
    total.value = data.total;
  } else {
    console.error('错误:', error);
  }
};

// 动态生成列配置，包括操作列
const generatedColumns = computed(() => {
  const columns =
    dataList.value.length > 0
      ? (columnsToShow === 'all' ? Object.keys(dataList.value[0]) : columnsToShow).map(key => ({
          title: key, // 标题可根据需要进行国际化处理
          key,
          render: row => <>{row[key]}</>
        }))
      : [];

  // 添加操作列
  if (table_actions.length > 0) {
    columns.push({
      title: '操作',
      key: 'actions',
      render: row => (
        <NSpace>
          {table_actions.map(action => (
            <NButton text size="small" onClick={() => action.callback(row)}>
              {action.label}
            </NButton>
          ))}
        </NSpace>
      )
    });
  }

  return columns;
});

// 分页配置
const paginationConfig = computed(() => ({
  page: the_page.value,
  pageSize: the_pageSize.value,
  pageCount: Math.ceil(total.value / the_pageSize.value),
  showSizePicker: true,
  onUpdatePage: newPage => {
    the_page.value = newPage;
  },
  onUpdatePageSize: newPageSize => {
    the_pageSize.value = newPageSize;
    the_page.value = 1; // 切换页面大小时回到第一页
  }
}));

// 监听分页和搜索条件的变化来重新获取数据
watchEffect(() => {
  getData();
});

// 搜索和重置逻辑
const handleSearch = () => {
  the_page.value = 1; // 开始搜索时回到第一页
  getData();
};

const handleReset = () => {
  searchCriteria.value = {}; // 清空搜索条件
  handleSearch(); // 重置搜索后重新获取数据
};
</script>

<template>
  <!-- 搜索输入和操作按钮 -->
  <div style="margin-bottom: 16px">
    <NSpace>
      <div v-for="config in searchConfigs" :key="config.key">
        <template v-if="config.type === 'input'">
          <NInput v-model:value="searchCriteria[config.key]" :placeholder="config.label" />
        </template>
        <template v-if="config.type === 'date-range'">
          <!-- 日期范围选择器，假设使用Naive UI的日期范围选择器 -->
          <NDatePicker v-model:value="searchCriteria[config.key]" type="daterange" :placeholder="config.label" />
        </template>
        <template v-if="config.type === 'select'">
          <!-- 下拉选择框 -->
          <NSelect v-model:value="searchCriteria[config.key]" :options="config.options" :placeholder="config.label" />
        </template>
        <template v-if="config.type === 'date'">
          <!-- 单一日期选择器 -->
          <NDatePicker v-model:value="searchCriteria[config.key]" type="date" :placeholder="config.label" />
        </template>
      </div>
    </NSpace>
    <NButton @click="handleSearch">搜索</NButton>
    <NButton @click="handleReset">重置</NButton>
  </div>
  <!-- 数据表格 -->
  <NDataTable :columns="generatedColumns" :data="dataList" :pagination="paginationConfig" />
</template>
