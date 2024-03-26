<!--
 * @Descripttion:
 * @version:
 * @Author: zhaoqi
 * @Date: 2024-03-23 11:36:02
 * @LastEditors: zhaoqi
 * @LastEditTime: 2024-03-26 11:12:48
-->
<script setup lang="tsx">
const videoSource = "";
function onPlay() {}
function onPause() {}
function onEnded() {}
</script>

<template>
  <n-card>
    <n-scrollbar style="max-height: 550px">
      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="设备详情">
          <div class="particulars-box">
            <div class="head-on-line">
              <div>
                <div class="on-line-text">在线状态</div>
                <div>在线</div>
              </div>
              <div>历史数据 ></div>
            </div>
            <div>
              <n-grid x-gap="12" :cols="2">
                <n-gi>
                  <div class="light-green">水压 10Mpa</div>
                </n-gi>
                <n-gi>
                  <div class="green">流量 10m³/h</div>
                </n-gi>
                <n-gi>
                  <div class="light-green">压力 20Mpa</div>
                </n-gi>
              </n-grid>
            </div>
            <div class="video-box">
              <video
                :src="videoSource"
                controls
                @play="onPlay"
                @pause="onPause"
                @ended="onEnded"
              ></video>
            </div>
          </div>
          <div class="equipment-information-box">
            <div class="equipment-information">设备信息</div>
            <div style="display: flex; flex-direction: column">
              <span>设备编号:</span>
              <span>设备名称:</span>
              <span>类型:</span>
              <span>型号:</span>
              <span>所属空间:</span>
              <span>区域位置:</span>
              <span>详情:</span>
            </div>
          </div>
          <div class="manipulate">
            <div class="manipulate-text">设备操控</div>
            <div class="manipulate-but"><n-button>单次控制</n-button></div>
            <div class="manipulate-but"><n-button>循环控制</n-button></div>
            <div class="manipulate-but"><n-button>重启</n-button></div>
            <div class="manipulate-but"><n-button>时长容量控制</n-button></div>
            <div class="manipulate-but"><n-button>参数查询</n-button></div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="the beatles" tab="告警日志"> 告警日志 </n-tab-pane>
      </n-tabs>
    </n-scrollbar>
  </n-card>
</template>

<style scoped>
.particulars-box {
  margin-top: 15px;
}

.head-on-line {
  display: flex;
  justify-content: space-between;
}
.video-box,
.equipment-information-box {
  margin-top: 15px;
}
.on-line-text,
.equipment-information,
.manipulate-text {
  font-size: 18px;
  font-weight: 700;
}
.manipulate-but {
  margin-top: 15px;
}
</style>
