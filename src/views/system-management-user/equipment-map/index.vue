<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 09:35:32
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-04-01 12:02:53
-->
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, useMessage } from 'naive-ui';
import * as echarts from 'echarts';
import screenfull from 'screenfull';
import { spacesData, sumData } from '@/service/api/equipment-map';
import { $t } from '@/locales';
import gaoDe from './components/map/gaode-map.vue';

const router = useRouter();
const queryParams = reactive({
  name: '',
  status: null
});
const message = useMessage();
const sumId = ref({
  id: ''
});

const gaoDeShow = ref(false);
const foldLine = ref(null);
const typeData = ref('');
const checkeds = ref(true);
const offLineChecked = ref(true);
const warningChecked = ref(true);
const normalChecked = ref(true);
const overviewShow = ref(false);
const getChildList = ref();
const loading = ref(false);
const former = ref({
  mapLocal: '',
  mapAddress: '',
  longitude: '', // 地图纬度信息
  latitude: '', // 地图经度信息
  scope: '' as any,
  dimension: [121.50861, 31.25141],
  districts: [] as any
});

/** 全屏 */
function screen() {
  screenfull.toggle();
}

/** 刷新地图 */
function refresh() {
  former.value.dimension = [];
  former.value.scope = [];
  getChildList.value.mapInit(former.value.dimension, former.value.scope);
}

/** @param e 重置 */
function handleReset() {
  queryParams.name = '';
  spacesDataList();
}

/** 添加空间/区域 */
function neaAreaClick() {
  router.push('/new-area');
}

/** 编辑空间 */

function editClick() {
  if (sumId.value.id.length === 0) {
    message.warning('请选择一个空间或者区域');
  } else {
    router.push({
      path: '/edit-area',
      query: { id: sumId.value.id, type: typeData.value }
    });
  }
}

/** 搜索列表 */
const listData = ref([
  {
    space_id: '',
    space_name: '',
    districts: [{ district_id: '', district_name: '' }]
  }
]);

/** 下拉列表 */
async function spacesDataList() {
  loading.value = true;
  const name = { name: queryParams.name };
  const { data } = await spacesData(name);
  console.log('列表111', data);
  if (data) {
    console.log('列表', data);
    listData.value = data.list;
    loading.value = false;
  }
}

/** 区域点击事件 */

function areaClick(e, w) {
  typeData.value = w;
  former.value.districts = [];
  former.value.scope = '';
  former.value.scope = JSON.parse(e.scope);
  e.districts.map(item => {
    return former.value.districts.push(item);
  });
  let data = [];
  data = e.location.split(',');
  const datas: any = [];
  datas[0] = Number(data[0]);
  datas[1] = Number(data[1]);
  former.value.dimension = datas;
  if (e) {
    sumId.value.id = e.space_id;
    gaoDeShow.value = true;
    sums();
  }
  getChildList.value.mapInit(former.value.dimension, e);
}

function selectClick(e, w) {
  former.value.scope = '';
  typeData.value = w;
  sumId.value.id = e.district_id;
  console.log(8888888, w);
  sums();
  former.value.scope = JSON.parse(e.scope);
  getChildList.value.mapInit(former.value.dimension, e);
}

/** 设备总数接口 */
const sumsdata = ref({
  device_activity: '0',
  device_on: '0',
  device_tota: '0'
});

function sums() {
  sumData(sumId.value).then(e => {
    if (e) {
      sumsdata.value = e.data;
      console.log('设备总数接口', sumsdata.value);
    }
  });
}

function nameInput() {
  console.log(111111, queryParams.name);
  spacesDataList();
}

// 图表

const init: () => void = () => {
  if (overviewShow.value) {
    const myecharts = echarts.init(foldLine.value, null, { renderer: 'svg' });

    const option = {
      title: {
        show: false
      },
      tooltip: {
        size: '20',
        trigger: 'axis', // 触发类型，可选为'item'、'axis'
        formatter(params) {
          // params是一个包含当前数据信息的数组
          const res = params.map(item => {
            // item 是单个数据的信息对象
            return (
              `<span style="font-size: 14px;font-weight: 600; color:rgba(35, 43, 46, 1); ">${item.seriesName}<br/>${item.data}mm` +
              `</span>`
            );
          });
          return res.join('<br/>'); // 使用换行符将多个数据项分隔开
        }
      },
      legend: {
        show: false
      },
      grid: {
        top: '5%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: $t('dashboard_panel.cardName.rainfall'),
          type: 'line',
          stack: 'Total',
          data: [
            50, 100, 120, 130, 150, 180, 200, 250, 290, 300, 240, 290, 300, 240, 220, 180, 160, 150, 180, 110, 190, 123,
            150, 200, 210, 260, 220, 210, 200, 280, 300
          ],
          areaStyle: {
            // 设置阴影样式
            color: new echarts.graphic.LinearGradient( // 使用线性渐变
              0,
              0,
              0,
              1, // 渐变方向（从左上角到右下角）
              [
                { offset: 0, color: 'rgba(11, 132, 240, .1)' }, // 结束颜色（完全透明）
                { offset: 1, color: 'rgba(255, 255, 255, 1)' } // 起始颜色（透明度为0.8的灰色）
              ]
            ),
            opacity: 1 // 设置阴影透明度（1表示完全不透明）
          }
        }
      ]
    };
    const dom = document.getElementById('foldLine')!;
    const ro = new ResizeObserver(_entries => {
      myecharts.resize();
    });
    ro.observe(dom);
    // 监听窗口大小变化
    myecharts.setOption(option);
  }
};

function overviewShowClick() {
  overviewShow.value = true;
}

onMounted(() => {
  spacesDataList();
  init();
});

function subcomponent(e) {
  overviewShow.value = true;
  sumId.value.id = e.district_id;
  sums();
}
</script>

<template>
  <div class="equipment">
    <gaoDe
      ref="getChildList"
      :keywords="former.mapLocal"
      :key-address="former.mapAddress"
      :lnglat-arr="former.scope"
      :is-marker-show="true"
      :dimension="former.dimension"
      :districts="former.districts"
      @subcomponent="subcomponent"
    />

    <div class="search-box">
      <div class="option">
        <n-space item-style="display: flex;">
          <n-checkbox v-model:checked="checkeds" value="onLine" label="在线" />
          <n-checkbox v-model:checked="offLineChecked" value="offLine" label="离线" />
          <n-checkbox v-model:checked="warningChecked" value="warning" label="告警" />
          <n-checkbox v-model:checked="normalChecked" value="normal" label="正常" />
        </n-space>
      </div>
      <div class="drop-down">
        <div class="drop-down-box">
          <NForm :model="queryParams" label-placement="left">
            <div class="search">
              <NInput
                v-model:value="queryParams.name"
                placeholder="搜索空间或区域"
                class="search-input"
                @change="nameInput"
              />
              <NButton class="w-72px" type="primary" @click="handleReset">重置</NButton>
            </div>
          </NForm>
          <div class="collapse">
            <n-scrollbar style="max-height: 220px">
              <n-collapse :loading="loading">
                <n-collapse-item title="全部">
                  <n-collapse>
                    <n-collapse-item
                      v-for="(item, index) in listData"
                      :key="index"
                      :title="item.space_name"
                      :name="item.space_id"
                      class="area-css"
                      @click="areaClick(item, 'space')"
                    >
                      <div
                        v-for="(items, index) in item.districts"
                        :key="index"
                        class="test-box"
                        @click.stop="selectClick(items, 'area')"
                      >
                        {{ items.district_name }}
                      </div>
                    </n-collapse-item>
                  </n-collapse>
                </n-collapse-item>
              </n-collapse>
            </n-scrollbar>

            <div class="add-but">
              <NButton class="edit-but" type="primary" @click="editClick">编辑当前空间/区域</NButton>
              <NButton type="primary" @click="neaAreaClick">添加空间/区域</NButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-space">
      <div class="button-box">
        <NButton strong secondary type="info" @click="screen">
          <SvgIcon class="full-screen" local-icon="ArrowExpand20Regular" />
        </NButton>
        <NButton strong secondary type="info" @click="refresh">
          <SvgIcon class="full-screen" local-icon="ArrowSync20Filled" />
        </NButton>
        <NButton strong secondary type="info" @click="overviewShowClick">
          <SvgIcon class="full-screen" local-icon="Box24Filled" />
        </NButton>
      </div>
      <div v-if="overviewShow" class="overview">
        <div class="text-head">
          <SvgIcon class="overview-icon" local-icon="Box24Filled" />
          <span class="text">设备总览</span>
        </div>
        <div class="on-line">
          <div>终端数量</div>
          <div class="sum-box">
            <div class="sum-title">设备总数</div>
            <div>
              <div class="sum-head">
                <SvgIcon class="sum-icon" local-icon="BezierCurveSquare12Filled" />
                <div class="sum">{{ sumsdata.device_tota }}</div>
              </div>
            </div>
            <div class="sum-particulars">
              <div>在线:{{ sumsdata.device_activity }}</div>
              <div>离线:{{ sumsdata.device_on }}</div>
              <div>在线率100%</div>
            </div>
          </div>
        </div>
        <div class="condition">
          <div>在线情况</div>
          <div class="line">
            <div id="foldLine" ref="foldLine" class="h-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.equipment {
  display: flex;
  justify-content: space-between;

  .add-space {
    width: 400px;
    height: 700px;
    opacity: 0.9;
  }
}

.overview {
  background: #fff;
  height: 500px;
  border-radius: 10px;
  opacity: 0.9;

  .text-head {
    margin-top: 20px;
    border-bottom: 1px solid #e6e6e6;
    padding: 10px 0;

    .overview-icon {
      margin-left: 20px;
      display: inline-block;
      font-size: 24px;
      color: blue;
    }

    .text {
      margin-left: 20px;
      font-size: 18px;
      font-weight: 500;
    }
  }

  .on-line {
    padding: 10px;

    .sum-box {
      margin-top: 15px;
      border: 1px solid blue;
      padding: 15px;
      border-radius: 15px;

      .sum-title {
        font-size: 20px;
        font-weight: 500;
      }

      .sum-head {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;

        .sum-icon {
          font-size: 28px;
          color: blue;
        }

        .sum {
          font-size: 28px;
          font-weight: 500;
        }
      }
    }
  }

  .sum-particulars {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }

  .condition {
    padding: 10px;
  }
}

.search-box {
  width: 300px;
  height: 500px;

  .option {
    padding: 10px;
    width: 100%;
    height: 40px;
    background: #fff;
    opacity: 0.9;
    border-radius: 5px;
    margin-bottom: 15px;
  }

  .drop-down {
    padding: 10px;
    opacity: 0.9;
    border-radius: 5px;
    width: 100%;
    height: 400px;
    background: #fff;
  }

  .add-but {
    width: 100%;
    position: absolute;
    bottom: 0;

    button {
      width: 100%;
    }
  }
}

.particulars {
  display: flex;
}

.search {
  display: flex;
}

.search-input {
  margin-right: 15px;
}

.collapse {
  position: relative;
  margin-top: 15px;
  height: 320px;
}

.device-type {
  display: flex;
  margin-top: 15px;
}

.type {
  margin-right: 15px;
}

.type-lf {
  width: 40%;
  margin-right: 10%;
  height: 100%;
}

.type-rg {
  width: 40%;
  height: 100%;
}

.test-box {
  padding: 10px;
}

.test-box:hover {
  color: rgb(47, 16, 189);
  cursor: pointer;
}

/* :deep(.n-tabs) {
  height: 620px !important;
} */
.full-screen {
  font-size: 24px;
}

.button-box {
  display: flex;
  justify-content: space-between;
}

.line {
  margin-top: 30px;
  width: 100%;
  height: 255px;

  div:nth-child(1) {
    font-size: 16px;
    font-weight: 600;
    line-height: 21.12px;
    color: rgba(35, 43, 46, 1);
    text-align: left;
  }

  .weather-card-item-active {
    background: rgba(50, 50, 153, 1) !important;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);

    .right > div > span:nth-child(1),
    .right > div > span:nth-child(2),
    .right > span:nth-child(2) {
      color: #fff !important;
    }
  }

  .icons {
    margin: 8px 4px;

    svg {
      margin-left: 15px;
      color: salmon;
      font-size: 20px;
    }
  }
}

.edit-but {
  margin-bottom: 15px;
}
</style>
