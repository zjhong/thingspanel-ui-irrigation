<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 11:36:02
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-26 11:09:58
-->
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { $t } from "@/locales";
// 图表
const foldLine = ref(null);

const init: () => void = () => {
  const myecharts = echarts.init(foldLine.value, null, { renderer: "svg" });
  const option = {
    title: {
      show: false,
    },
    tooltip: {
      size: "20",
      trigger: "axis", // 触发类型，可选为'item'、'axis'
      formatter(params) {
        // params是一个包含当前数据信息的数组
        const res = params.map((item) => {
          // item 是单个数据的信息对象
          return (
            `<span style="font-size: 14px;font-weight: 600; color:rgba(35, 43, 46, 1); ">${item.seriesName}<br/>${item.data}mm` +
            `</span>`
          );
        });
        return res.join("<br/>"); // 使用换行符将多个数据项分隔开
      },
    },
    legend: {
      show: false,
    },
    grid: {
      top: "5%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["1", "2", "3", "4", "5", "6", "7"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: $t("dashboard_panel.cardName.rainfall"),
        type: "line",
        stack: "Total",
        data: [
          50, 100, 120, 130, 150, 180, 200, 250, 290, 300, 240, 290, 300, 240,
          220, 180, 160, 150, 180, 110, 190, 123, 150, 200, 210, 260, 220, 210,
          200, 280, 300,
        ],
        areaStyle: {
          // 设置阴影样式
          color: new echarts.graphic.LinearGradient( // 使用线性渐变
            0,
            0,
            0,
            1, // 渐变方向（从左上角到右下角）
            [
              { offset: 0, color: "rgba(11, 132, 240, .1)" }, // 结束颜色（完全透明）
              { offset: 1, color: "rgba(255, 255, 255, 1)" }, // 起始颜色（透明度为0.8的灰色）
            ]
          ),
          opacity: 1, // 设置阴影透明度（1表示完全不透明）
        },
      },
    ],
  };
  const dom = document.getElementById("foldLine")!;
  const ro = new ResizeObserver((_entries) => {
    myecharts.resize();
  });
  ro.observe(dom);
  // 监听窗口大小变化
  myecharts.setOption(option);
};
onMounted(() => {
  init();
});
</script>

<template>
  <n-card title="设备总览">
    <div>
      <div>终端数量</div>
      <NCard>
        <div>设备总数 7</div>
        <div class="subdivide">
          <n-grid x-gap="12" :cols="3">
            <n-gi>
              <div class="light-green">在线 7</div>
            </n-gi>
            <n-gi>
              <div class="green">离线 0</div>
            </n-gi>
            <n-gi>
              <div class="light-green">在线率 100%</div>
            </n-gi>
          </n-grid>
        </div>
      </NCard>
      <div class="condition">在线情况</div>
      <div class="line">
        <div id="foldLine" ref="foldLine" class="h-full w-full"></div>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.subdivide,
.condition {
  margin-top: 20px;
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
</style>
