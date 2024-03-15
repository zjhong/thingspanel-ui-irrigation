<script lang="tsx" setup>
import type { VueElement } from 'vue';
import { computed, defineProps, ref, watchEffect } from 'vue';
import { NButton, NDataTable, NDatePicker, NInput, NSelect, NSpace } from 'naive-ui';
import type { TreeSelectOption } from 'naive-ui';
import { throttle } from 'lodash-es';
// 定义搜索配置项的类型
export type SearchConfig =
  | {
      key: string;
      label: string;
      type: 'input' | 'date' | 'date-range';
    }
  | {
      key: string;
      label: string;
      type: 'select';
      options: { label: string; value: any }[];
      loadOptions?: (pattern) => Promise<{ label: string; value: any }[]>;
    }
  | {
      key: string;
      label: string;
      type: 'tree-select';
      options: TreeSelectOption[];
      multiple: boolean;
      loadOptions?: () => Promise<TreeSelectOption[]>;
    };

// 使用props接收父组件传递的参数
const props = defineProps<{
  fetchData: (data: any) => Promise<any>;
  columnsToShow:
    | {
        key: string;
        label: string;
        render?: (row: any) => VueElement | string | undefined;
      }[]
    | 'all';
  searchConfigs: SearchConfig[];
  tableActions: Array<{
    label: string;
    callback: (row: any) => void;
  }>;
  topActions: Array<{
    // 重新命名以避免混淆
    label: string;
    onClick: () => void; // 点击事件处理函数
  }>;
}>();

// 解构props以简化访问
const { fetchData, columnsToShow, tableActions, searchConfigs } = props;
const isTableView = ref(true); // 默认显示表格视图
// 组件状态：数据列表、总数、当前页、页面大小
const dataList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索条件状态
const searchCriteria = ref({});

// 获取数据函数，结合分页和搜索逻辑
const getData = async () => {
  const processedSearchCriteria = Object.fromEntries(
    Object.entries(searchCriteria.value).map(([key, value]) => {
      if (value && Array.isArray(value)) {
        return [key, value.map(v => (v instanceof Date ? v.toISOString() : v))];
      }
      return [key, value instanceof Date ? value.toISOString() : value];
    })
  );

  const response = await fetchData({
    page: currentPage.value,
    page_size: pageSize.value,
    ...processedSearchCriteria
  });

  if (!response.error) {
    dataList.value = response.data.list;
    total.value = response.data.total;
  } else {
    console.error('Error fetching data:', response.error);
  }
};

// 动态生成列配置，包括操作列
const generatedColumns = computed(() => {
  let columns;

  if (dataList.value.length > 0) {
    columns = (columnsToShow === 'all' ? Object.keys(dataList.value[0]) : columnsToShow).map(item => {
      if (item.render) {
        // 使用自定义的render函数渲染列
        return {
          title: item.label,
          key: item.key,
          render: row => item.render(row)
        };
      }
      return {
        title: item.label,
        key: item.key,
        render: row => <>{row[item.key]}</>
      };
    });
    columns.push({
      title: '操作',
      key: 'actions',
      render: row => (
        <NSpace>
          {tableActions.map(action => (
            <NButton text size="small" onClick={() => action.callback(row)}>
              {action.label}
            </NButton>
          ))}
        </NSpace>
      )
    });
  }

  return columns || [];
});

// 分页配置计算属性

const onUpdatePage = newPage => {
  currentPage.value = newPage;
  getData(); // 更新数据
};
const onUpdatePageSize = newPageSize => {
  pageSize.value = newPageSize;
  currentPage.value = 1; // 重置为第一页
  getData(); // 更新数据
};
// 重新获取数据当分页和搜索条件变化
watchEffect(getData);

// 搜索和重置按钮逻辑
const handleSearch = () => {
  console.log('Resetting search criteria');
  currentPage.value = 1; // 搜索时重置到第一页
  getData();
};

const handleReset = () => {
  Object.keys(searchCriteria.value).forEach(key => {
    searchCriteria.value[key] = ''; // 或者对应字段的默认值
  });
  handleSearch(); // 重新获取数据
};

const handleTreeSelectUpdate = (value, key) => {
  searchCriteria.value[key] = value;
};

const loadOptionsOnMount = async pattern => {
  for (const config of searchConfigs) {
    if (config.type === 'select' && config.loadOptions) {
      // eslint-disable-next-line no-await-in-loop
      const opts = await config.loadOptions(pattern); // 调用传入的loadOptions函数加载选项数据
      config.options = [...config.options, ...opts];
    }
  }
};

const loadOptionsOnMount2 = async () => {
  for (const config of searchConfigs) {
    if (config.type === 'tree-select' && config.loadOptions) {
      // eslint-disable-next-line no-await-in-loop
      const opts = await config.loadOptions(); // 调用传入的loadOptions函数加载选项数据
      config.options = [...config.options, ...opts];
    }
  }
};
const throttledLoadOptionsOnMount = throttle(loadOptionsOnMount, 300);
loadOptionsOnMount('');
loadOptionsOnMount2();
</script>

<template>
  <div class="flex flex-col gap-6 rounded-lg bg-[#fff] p-6 shadow">
    <!-- 搜索区域与操作按钮 -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <!-- 搜索输入和选择器 -->
      <div class="flex flex-1 flex-wrap items-end gap-4">
        <div v-for="config in searchConfigs" :key="config.key" class="flex flex-col gap-2">
          <template v-if="config.type === 'input'">
            <NInput v-model:value="searchCriteria[config.key]" :placeholder="config.label" class="input-style" />
          </template>
          <template v-else-if="config.type === 'date-range'">
            <NDatePicker
              v-model:value="searchCriteria[config.key]"
              type="daterange"
              :placeholder="config.label"
              class="input-style"
            />
          </template>
          <template v-else-if="config.type === 'select'">
            <NSelect
              v-model:value="searchCriteria[config.key]"
              filterable
              :options="config.options"
              :placeholder="config.label"
              class="input-style min-w-240px"
              @search="
                value => {
                  throttledLoadOptionsOnMount(value);
                }
              "
            />
          </template>
          <template v-else-if="config.type === 'date'">
            <NDatePicker
              v-model:value="searchCriteria[config.key]"
              type="date"
              :placeholder="config.label"
              class="input-style"
            />
          </template>
          <template v-else-if="config.type === 'tree-select'">
            <n-tree-select
              v-model:value="searchCriteria[config.key]"
              filterable
              :options="config.options"
              :multiple="config.multiple"
              class="input-style min-w-240px"
              @update:value="value => handleTreeSelectUpdate(value, config.key)"
            />
          </template>
        </div>
        <NButton class="btn-style" @click="handleSearch">搜索</NButton>
        <NButton class="btn-style" @click="handleReset">重置</NButton>
      </div>
      <!-- 新建与返回按钮 -->
    </div>
    <div class="mb--6 flex items-center justify-between">
      <div class="flex gap-2">
        <NButton v-for="action in topActions" :key="action.label" class="btn-style" @click="action.onClick">
          {{ action.label }}
        </NButton>
      </div>
      <!-- 组件内部的表操作 -->
      <div>
        <NButton quaternary @click="isTableView = true">
          <template #icon>
            <n-icon text style="font-size: 24px">
              <icon-material-symbols:table-rows-narrow-outline-sharp class="text-24px" />
            </n-icon>
          </template>
        </NButton>
        <NButton quaternary @click="isTableView = false">
          <template #icon>
            <n-icon text style="font-size: 24px">
              <icon-material-symbols:map-rounded class="text-24px" />
            </n-icon>
          </template>
        </NButton>
        <NButton quaternary @click="getData">
          <template #icon>
            <n-icon text style="font-size: 24px">
              <icon-material-symbols:refresh class="text-24px" />
            </n-icon>
          </template>
        </NButton>
      </div>
    </div>
    <!-- 数据表格 -->
    <div v-if="isTableView" class="overflow-x-auto">
      <NDataTable :columns="generatedColumns" :data="dataList" class="card-wrapper" />
    </div>
    <div v-else>
      <!-- 地图视图占位 -->
      <div class="map-placeholder">地图视图占位</div>
    </div>

    <n-pagination
      v-model:page="currentPage"
      v-model:page-size="pageSize"
      class="justify-end"
      :item-count="total"
      :page-size-options="[10, 20, 30, 40]"
      show-size-picker
      @update:page="onUpdatePage"
      @update:page-size="onUpdatePageSize"
    />
  </div>
</template>

<style scoped>
.input-style {
  @apply border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)];
}

.btn-style {
  @apply text-black hover:bg-[var(--color-primary-hover)] rounded-md shadow;
}

.card-wrapper {
  @apply rounded-lg shadow overflow-hidden;
  margin: 0 auto;
  padding: 16px;
}
</style>
