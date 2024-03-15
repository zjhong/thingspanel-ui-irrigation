<script lang="ts" setup>
</script>

<template>
  <div class="device flex-items-center flex-col flex-justify-center">
    <div class="device-top w-full h-full flex flex-items-center flex-justify-between">
      <div class="left h-full flex-col">
        <span>设备总数</span>
        <span>7</span>
      </div>
      <SvgIcon local-icon="device" class="device-icon" />
    </div>
    <div class="device-bottom w-full flex flex-items-center  flex-justify-between flex-content-start m-t3">
      <div class="device-bottom-state flex flex-items-center">
        <SvgIcon local-icon="on-line" class="device_bottom-icon" />
        <span>在线 7</span>
      </div>
      <div class="device-bottom-state flex flex-items-center">
        <SvgIcon local-icon="offline" class="device_bottom-icon" />
        <span>离线 0</span>
      </div>
      <div class="device-bottom-state flex flex-items-center">
        <SvgIcon local-icon="online-rate1" class="device_bottom-icon" />
        <span>在线率 100%</span>
        <SvgIcon local-icon="online-rate2" class="device_bottom-icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.device {
  padding: 0 70px;

  .device-top {
    .left>span:nth-child(1) {
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: bold;
      line-height: 18.48px;
      color: rgba(35, 43, 46, 1);
      text-align: left;
    }

    .left>span:nth-child(2) {
      font-size: 26px;
      font-weight: bold;
      line-height: 31.49px;
      color: rgba(0, 0, 0, 1);
      text-align: left;
    }

    .device-icon {
      font-size: 70px;
    }
  }

  .device-bottom {
    .device-bottom-state {
      position: relative;
    }

    .device-bottom-state>svg:nth-child(1) {
      font-size: 16px;
    }

    .device-bottom-state>span:nth-child(2) {
      font-size: 14px;
      font-weight: 400;
      line-height: 18.48px;
      color: #7A8487FF;
      text-align: left;
      margin: 0 10px;
    }

    .device-bottom-state>svg:nth-child(3) {
      font-size: 9px;
      position: absolute;
      top: -1px;
      left: 9px;
    }
  }
}
</style>
