<template>
  <div class="topBackWrap">
    <div class="backWrap" @click="routeBack">
      <img class="backIcon" :src="IconBack" alt="">
      <div class="chapterName">{{ chapterName }}</div>
      <van-popup v-model:show="isRetain" round :close-on-click-overlay="false">
        <div class="retainBox">
          <img class="close" :src="IconClose" alt="" @click.stop="onCancelX">
          <div class="bookName">{{ bookInfo.bookName || '' }}</div>
          <p class="sub">{{ $t('player.backTip') }}</p>
          <div class="btnBox">
            <div class="cancel" @click.stop="onCancel">取消</div>
            <div class="confirm" @click.stop="onConfirm">收藏</div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script lang="ts" setup>
import IconClose from '@/assets/images/close-icon.png'
import IconBack from '@/assets/images/back.png'
import { computed } from 'vue'
import { EAutoAdd } from '@/types/common.interface'
import { AppModule } from '@/store/modules/app'
import { DeviceModule } from '@/store/modules/device'
import { netDrama } from '@/api/player'
import { ChaptersModule } from '@/store/modules/chapters'
const chapterName = computed(() => AppModule.swipeList.length > 0 ? `第${AppModule.swipeList[AppModule.swipeIndex].chapterIndex}集` : '')
const bookInfo = computed(() => AppModule.bookInfo)
const isRetain = computed(() => DeviceModule.isRetain)
// 退出播放器
const routeBack = () => {
  if (ChaptersModule.isCatalogPopupVisible) {
    ChaptersModule.SetIsCatalogPopupVisible(false)
    return
  }
  if (bookInfo.value.autoAdd === EAutoAdd.否) {
    DeviceModule.SetIsRetain(true)
  } else {
    DeviceModule.ToLeavePlayer()
  }
}

const onCancel = () => {
  DeviceModule.SetIsRetain(false)
  DeviceModule.ToLeavePlayer()
}

const onConfirm = () => {
  DeviceModule.SetIsRetain(false)
  netDrama(AppModule.bookInfo.bookId)
  DeviceModule.ToLeavePlayer()
}

const onCancelX = () => {
  DeviceModule.SetIsRetain(false)
}

</script>

<style lang="less" scoped>
.topBackWrap {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 1.4rem;
  background-color: #0F0F0F
}
.backWrap {
  position: absolute;
  top: 0.7rem;
  left: 0;
  z-index: 1;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.4rem;

  .backIcon {
    width: 0.32rem;
    height: 0.44rem;
    margin-right: 0.24rem;
  }

  .chapterName {
    flex: 1;
    font-size: 0.32rem;
    font-weight: 500;
    color: #FFFFFF;
    text-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.4);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.retainBox {
  width: 6.1rem;
  height: 3.94rem;
  padding: 0.54rem 0.32rem 0.48rem;
  background-color: #FFF;
  position: relative;
  text-align: center;

  .close {
    position: absolute;
    z-index: 1;
    top: 0.24rem;
    right: 0.24rem;
    width: 0.3rem;
    height: 0.3rem;
  }

  .bookName {
    font-size: 0.38rem;
    font-weight: bold;
    color: #222222;
    height: 0.54rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .sub {
    font-size: 0.30rem;
    font-weight: 400;
    color: #666666;
    margin: 0.34rem 0 0.64rem;
  }

  .btnBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;

    .cancel {
      width: 2rem;
      height: 0.94rem;
      border-radius: 0.49rem;
      border: 0.02rem solid #FF4B00;
      font-size: 0.34rem;
      font-weight: 500;
      color: #FF4B00;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .confirm {
      width: 3.14rem;
      height: 0.98rem;
      border-radius: 0.49rem;
      background-color: #FF4B00;
      font-size: 0.34rem;
      font-weight: 500;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

</style>
