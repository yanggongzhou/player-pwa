<template>
  <div class="playerWrap">
    <back-title />
    <network-err />
    <ending-normal />
    <operation-tip v-if="isShowOperationTip" />
    <div class="playerBox">
      <div
        class="pulRefresh"
        @touchmove.stop="playTouchmove"
        @touchstart.stop="playTouchstart">
        <video-swiper />
      </div>
      <catalog-normal />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { netVideoPre } from '@/api/player'
import VideoSwiper from '@/views/player/videoUnion/videoSwiper.vue'
import CatalogNormal from '@/views/player/catalog/catalogNormal.vue'
import { Toast } from 'vant'
import BackTitle from '@/components/backTitle.vue'
import NetworkErr from '@/components/networkErr.vue'
import EndingNormal from '@/views/player/controlPage/endingNormal.vue'
import { AppModule } from '@/store/modules/app'
import { DeviceModule } from '@/store/modules/device'
import { ChaptersModule } from '@/store/modules/chapters'
import { EChapterStatus, EIsCharge } from '@/types/common.interface'
import { IChapterInfo } from '@/types/player.interface'
import { useI18n } from 'vue-i18n'
import { debounce } from 'throttle-debounce'
import OperationTip from '@/views/player/controlPage/operationTip.vue'

const isShowOperationTip = computed(() => DeviceModule.isShowOperationTip);
const { t } = useI18n()
const onRefresh = async () => {
  if (chapterInfo.value.chapterIndex === 1) {
    Toast({ message: t('player.firstTip'), position: 'top', className: 'topToastBox' })
    return
  }
  const preChapter = ChaptersModule.chapterAllList[chapterInfo.value.chapterIndex - 2]
  if (!preChapter || !preChapter.chapterId) return
  if (preChapter.isCharge === EIsCharge.收费) {
    if (!ChaptersModule.isPayVisible) {
      // 上滑上一章付费情况
      AppModule.RefreshVideoSource({
        bookInfo: AppModule.bookInfo,
        chapterInfo: {
          chapterId: preChapter.chapterId,
          chapterStatus: EChapterStatus.未付费,
          chapterIndex: preChapter.chapterIndex,
          chapterName: preChapter.chapterName
        }
      })
    }
  } else {
    if (!DeviceModule.isPrevRefresh) {
      DeviceModule.SetIsPrevRefresh(true)
      netVideoPre(AppModule.bookInfo.bookId, preChapter.chapterId)
    }
  }
}

const chapterInfo = computed(() => AppModule.swipeList[AppModule.swipeIndex] || {} as IChapterInfo)

// 监听上滑行为 当列表为空 或 swipe的索引不是首页时禁止执行
const shouldWatchTouchUp = computed(() => AppModule.swipeList.length === 0 || AppModule.swipeIndex !== 0)
const shouldWatchTouchDown = computed(() => AppModule.swipeList.length === 0 || AppModule.swipeIndex !== AppModule.swipeList.length - 1)
const touchY = ref(0)
const playTouchstart = (e: TouchEvent) => {
  touchY.value = e.targetTouches[0].clientY
}
const playTouchmove = debounce(500, (e: TouchEvent) => {
  // 下滑上一集
  if (e.targetTouches[0].clientY - touchY.value >= 80) {
    if (shouldWatchTouchUp.value) return
    console.log('------------下滑手势------------')
    onRefresh()
  }
  if (touchY.value - e.targetTouches[0].clientY >= 80) {
    if (shouldWatchTouchDown.value) return
    console.log('------------上滑手势------------')
    onNextChapter()
  }
})

const onNextChapter = () => {
  const nextChapter = ChaptersModule.chapterAllList[chapterInfo.value.chapterIndex]
  if (!nextChapter || !nextChapter.chapterId || chapterInfo.value.chapterIndex === ChaptersModule.totalChapters) return
  if (nextChapter.isCharge === EIsCharge.收费) {
    if (!ChaptersModule.isPayVisible) {
      // 上滑上一章付费情况
      AppModule.RefreshVideoSource({
        bookInfo: AppModule.bookInfo,
        chapterInfo: {
          chapterId: nextChapter.chapterId,
          chapterStatus: EChapterStatus.未付费,
          chapterIndex: nextChapter.chapterIndex,
          chapterName: nextChapter.chapterName
        }
      })
    }
  } else {
    if (!DeviceModule.isPrevRefresh) {
      DeviceModule.SetIsPrevRefresh(true)
      netVideoPre(AppModule.bookInfo.bookId, nextChapter.chapterId)
    }
  }
}

</script>

<style lang="less" scoped>
.playerWrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 0;
  .playerBox {
    position: relative;
    width: 100%;
    height: calc(100% - 1.4rem);
    //height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    font-size: 0;
    overflow: hidden;
  }
  .pulRefresh {
    width: 100%;
    height: calc(100% - 1.28rem);
    flex: 1;
    overflow: hidden;
  }
}
</style>
