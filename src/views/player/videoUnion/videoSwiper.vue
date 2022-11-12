<template>
  <van-swipe
    ref="swipeRef"
    class="swipeWrap"
    vertical
    :touchable="!isPayVisible"
    stop-propagation
    :loop="false"
    :duration="200"
    :show-indicators="false"
    @change="onChange">
    <van-swipe-item
      class="swipeItem"
      v-for="(val,ind) in swipeList"
      :key="val.chapterId">
      <un-lock
        v-if="val.chapterStatus === EChapterStatus.未付费"
        :is-show-page="ind === swipeIndex"
        :chapter-index="val.chapterIndex"
        @unlock="onUnlock(val.chapterId)"/>
      <template v-else>
<!--        (swipeIndex > ind ? swipeIndex - ind <= 1 : ind - swipeIndex <= 1)-->
        <video-normal
          :key="val.chapterId + 'video'"
          v-if="swipeIndex === ind && val.content"
          :is-show-page="ind === swipeIndex"
          :chapter-info="val"
          @videoEnd="videoEnd"
        />
        <img v-if="swipeIndex !==ind && val.chapterUrl" class="posterImg" :src="val.chapterUrl" @error="imgError" alt="">
      </template>
    </van-swipe-item>
  </van-swipe>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import VideoNormal from '@/views/player/videoUnion/videoNormal.vue'
import { AppModule } from '@/store/modules/app'
import { EChapterStatus, EIsPay } from '@/types/common.interface'
import UnLock from '@/views/player/controlPage/unLock.vue'
import { netWebAndPay } from '@/api/player'
import { IBookInfo, IChapterInfo } from '@/types/player.interface'
import type { SwipeInstance } from 'vant'
import { ChaptersModule } from '@/store/modules/chapters'
import { DeviceModule } from '@/store/modules/device'
import { imgError } from '@/utils/imgError'
import playerBus from '@/utils/playerBus'

const swipeRef = ref<SwipeInstance>({} as SwipeInstance)
const swipeIndex = computed(() => AppModule.swipeIndex)
const swipeList = computed(() => AppModule.swipeList)
const timer = ref<number>(0)
const isPayVisible = computed(() => ChaptersModule.isPayVisible)

watch(() => AppModule.swipeIndex, (index) => {
  if (index === 0) {
    swipeRef.value.swipeTo(0, { immediate: true })
  }
})

const onUnlock = (chapterId: string) => {
  clearTimeout(timer.value)
  timer.value = setTimeout(() => { // 处理部分机型swipe会卡半截问题
    // onUnlock(swipeList.value[index].chapterId)
    DeviceModule.SetIsShowUnlockTip(false)
    const { bookId } = AppModule.bookInfo
    if (swipeList.value[swipeIndex.value].chapterId === chapterId) {
      netWebAndPay(bookId, chapterId)
    }
  }, 500)
}

const videoEnd = () => {
  if (swipeList.value.length > swipeIndex.value + 1) {
    swipeRef.value.next()
  }
}

// 上下屏切换
const onChange = (index: number) => {
  AppModule.SetSwipeIndex(index)
};

// AndWebPay 关闭付费窗口
const AndWebPay = async ({
  isPay,
  bookInfo,
  chapterInfo
}: { isPay: EIsPay, bookInfo: IBookInfo, chapterInfo?: IChapterInfo }) => {
  console.log('-------------AndWebPay 关闭付费窗口-----------------', isPay, bookInfo, chapterInfo)
  ChaptersModule.SetIsPayVisible(false)
  bookInfo && AppModule.SetBookInfo(bookInfo)
  if (isPay === EIsPay.否) {
    DeviceModule.SetIsShowUnlockTip(true)
  }
  if (isPay === EIsPay.是) {
    DeviceModule.SetIsShowUnlockTip(false)
    await ChaptersModule.GetAllChapterList(AppModule.bookInfo.bookId)
    if (!chapterInfo) return
    AppModule.RefreshPaySource(chapterInfo)
  }
}

const jumpSwipe = (swipeIndex: number) => {
  swipeRef.value.swipeTo(swipeIndex, { immediate: true })
}

onBeforeMount(() => {
  playerBus.on('jumpSwipe', jumpSwipe as any);
})

onBeforeUnmount(() => {
  playerBus.off('jumpSwipe', jumpSwipe as any);
})

</script>

<style lang="less" scoped>
.swipeWrap {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 9;
  flex: 1;

  .swipeItem {
    width: 100%;
    height: 100%;

    .posterImg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #0F0F0F;
    }
  }
}
</style>
