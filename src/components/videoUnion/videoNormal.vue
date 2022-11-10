<template>
  <div class="videoWrap">
    <VideoPlayer
      class="video-player vjs-custom-skin"
      :class="isShowPoster && 'vjs-custom-poster'"
      @canplay="onCanplay"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @waiting="onWaiting"
      @timeupdate="onTimeupdate"
      @error="onErrorEve"
      :options="options"/>
    <loading-normal :duration="duration" v-if="isLoading" :message="[$t('player.loadingTip1'), $t('player.loadingTip2')]" animation/>
    <video-control
      :duration="duration"
      :is-show-stop="isShowStop && !isLoading"
      :progress="progress"
      @controlPlay="controlPlay"
      @dragProgress="dragProgress"
    />
  </div>
</template>

<script lang="ts" setup>
import VideoControl from '@/components/videoUnion/videoControl.vue'
import LoadingNormal from '@/components/controlPage/loadingNormal.vue'
import {
  ref,
  defineComponent,
  reactive,
  onBeforeUnmount,
  watch,
} from 'vue'
import { VideoPlayer } from 'vue-video-player'
import { IChapterInfo } from '@/types/player.interface'
import { netWebAndLog } from '@/api/player'
import { DeviceModule } from '@/store/modules/device'
import { AppModule } from '@/store/modules/app'
import { ChaptersModule } from '@/store/modules/chapters'
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { throttle } from 'throttle-debounce'

defineComponent({
  VideoPlayer
})

const videoInstance = ref<VideoJsPlayer>({} as VideoJsPlayer)
const isLoading = ref(true)// 视频加载状态
const isShowStop = ref(true) // 暂停按钮
const duration = ref(0) // 视频总时长
const progress = ref(0) // 进度条

interface IProps {
  chapterInfo: IChapterInfo;
  isShowPage: boolean;
}
const props = defineProps<IProps>()
// 运行时
const emits = defineEmits(['videoEnd', 'videoStageState', 'videoError'])
// // 基于类型
// const emits = defineEmits<{(e: 'videoEnd'): void;}>()

const options = reactive<VideoJsPlayerOptions>({
  language: 'zh-CN',
  preload: 'auto', // none：表示不应预加载视频 | metadata：表示仅获取视频元数据（例如长度）| auto：表示可以下载整个视频文件，即使用户不希望使用它。
  techOrder: ['html5'], // 兼容顺序，默认值是['html5']，其他已注册的技术将按其注册的顺序在该技术之后添加。
  muted: false, // 静音
  defaultVolume: 1, // 默认音量大小
  loop: false, // 循环播放
  autoplay: props.isShowPage, // 自动播放
  poster: props.chapterInfo.chapterUrl, // 封面
  fluid: true, // 当true时，将按比例缩放以适应其容器。
  // withCredentials: false,
  // hls: true,
  sources: [ // 等同于原生<video>标签中的一组<source>子标签，可实现优雅降级；type 属性规定媒体资源的 MIME 类型
    {
      type: 'video/mp4',
      src: (props.chapterInfo.content && props.chapterInfo.content.mp4720p) as string // url地址
    },
    {
      // type: 'application/x-mpegURL',
      type: 'video/mp4',
      src: (props.chapterInfo.content && props.chapterInfo.content.m3u8) as string // url地址
    }
  ],
  controls: false, // 是否显示控制器
  playsinline: true // the video is to be played "inline", that is within the element's playback area
  // crossOrigin: 'use-credentials', // use-credentials anonymous
})

// 是否暂停视频
watch(() => [DeviceModule.isPrevRefresh, AppModule.isShowEndPage, props.isShowPage, DeviceModule.isOnline, ChaptersModule.isPayVisible],
  ([isPrevRefresh, isShowEndPage, isShowPage, isOnline, isPayVisible]) => {
    // 是否暂停视频
    // const isPlaying = videoInstance.value.paused && !videoInstance.value.paused()
    const isPlaying = true
    // 监听是否显示全局形式loading
    const isPageLoading = isPrevRefresh && isShowPage && !isShowEndPage
    if (isPageLoading) {
      isLoading.value = true
    }
    // 监听是否显示最终页了
    // 监听视频是否断网
    // 监听显示支付弹框
    // 离开当前屏幕
    if ((isPageLoading || isShowEndPage || !isShowPage || !isOnline || isPayVisible) && isPlaying) {
      videoInstance.value.pause()
    }
  }
)
watch(() => [props.isShowPage, DeviceModule.isOnline, ChaptersModule.isPayVisible],
  ([isShowPage, isOnline, isPayVisible]) => {
    const isPlaying = videoInstance.value.paused && videoInstance.value.paused()
    // 是否开始视频
    if (isShowPage && !AppModule.isShowEndPage && !isPayVisible && isOnline && isPlaying) {
      videoInstance.value.play()
    }
  }
)
watch(() => [props.isShowPage, DeviceModule.isOnline, DeviceModule.isNeedReload],
  ([isShowPage, isOnline, isNeedReload]) => {
    // 是否重置视频，由断网引起的视频加载失败
    if (isShowPage && isNeedReload && isOnline) {
      videoInstance.value.reset && videoInstance.value.reset()
      DeviceModule.SetIsNeedReload(false);
    }
  }
)
// 暂停按钮
const controlPlay = () => {
  if (videoInstance.value.paused && videoInstance.value.paused()) {
    videoInstance.value.play && videoInstance.value.play()
  } else {
    videoInstance.value.pause && videoInstance.value.pause()
  }
}

const dragProgress = (progressValue: number) => {
  isLoading.value = true
  if (duration.value && duration.value > 0) {
    videoInstance.value.currentTime(progressValue / 100 * duration.value - 0.5)
  }
  if (props.isShowPage && !AppModule.isShowEndPage && videoInstance.value.paused && videoInstance.value.paused()) {
    videoInstance.value.play()
  }
  videoStageStateData.dragCount += 1
  dragDurationTime.value = new Date().getTime();
}
// 是否显示封面
const isShowPoster = ref(true)

const onCanplay = (ev: { target: { player: VideoJsPlayer } }) => {
  videoInstance.value = ev.target.player
  duration.value = ev.target.player.duration() || 0
  isLoading.value = false
  if (props.isShowPage && videoInstance.value.paused && videoInstance.value.paused()) {
    videoInstance.value.play()
  }
  const nowTime = new Date().getTime()
  if (dragDurationTime.value > 0) {
    videoStageStateData.dragWaitTimeDifference += waitDurationTime.value - dragDurationTime.value;
    videoStageStateData.dragDuration += nowTime - dragDurationTime.value
    dragDurationTime.value = 0;
  }
  if (waitDurationTime.value > 0) {
    videoStageStateData.waitDuration += nowTime - waitDurationTime.value
    waitDurationTime.value = 0;
  }
}
const onPlay = () => {
  isShowStop.value = false
  videoStageStateData.playCount += 1;
}
const onPause = () => {
  isShowStop.value = true
  videoStageStateData.pausedCount += 1;
}
const onEnded = () => {
  netWebAndLog({
    type: 'readplayletEnd',
    item_id: AppModule.bookInfo.bookId,
    chapter_word_number: duration.value,
    chapter_number: props.chapterInfo.chapterIndex,
    chapter_name: props.chapterInfo.chapterName,
    chapter_id: props.chapterInfo.chapterId
  })
  // 剧集播放完毕
  if (ChaptersModule.totalChapters > 0 && props.chapterInfo.chapterIndex === ChaptersModule.totalChapters) {
    AppModule.SetIsShowEndPage(true)
  } else {
    emits('videoEnd')
  }
}
const onTimeupdate = (ev: { target: { player: VideoJsPlayer } }) => {
  const player = ev.target.player
  if (!duration.value || duration.value === 0) {
    duration.value = player.duration()
  }

  if (player.bufferedEnd() - player.currentTime() < 2) {
    addBufferedEndCurrentTimeCount()
  }

  if (player.currentTime() > 0 && isShowPoster.value) {
    DeviceModule.SetReadChapterList(props.chapterInfo.chapterId)
    isShowPoster.value = false
    startDate.value = Math.round(new Date().getTime() / 1000);
    netWebAndLog({
      type: 'readplayletBegin',
      item_id: AppModule.bookInfo.bookId,
      chapter_word_number: duration.value,
      chapter_number: props.chapterInfo.chapterIndex,
      chapter_name: props.chapterInfo.chapterName,
      chapter_id: props.chapterInfo.chapterId
    })
  }
  progress.value = Math.floor(player.currentTime() / duration.value * 100)
}
// 加载loading显示
const onWaiting = () => {
  isLoading.value = true
  videoStageStateData.waitCount += 1;
  waitDurationTime.value = new Date().getTime();
}
// 错误处理
const onErrorEve = (ev: { target: { player: VideoJsPlayer } }) => {
  if (!DeviceModule.isOnline) {
    DeviceModule.SetIsNeedReload(true);
  }
  emits('videoError', {
    networkState: ev.target.player.networkState && ev.target.player.networkState(),
    chapterId: props.chapterInfo.chapterId,
  })
}
const startDate = ref(Math.round(new Date().getTime() / 1000))
const waitDurationTime = ref(0)
const dragDurationTime = ref(0)
const videoStageStateData = reactive({
  waitCount: 0,
  waitDuration: 0,
  dragWaitTimeDifference: 0,
  dragCount: 0,
  dragDuration: 0,
  pausedCount: 0,
  playCount: 0,
  bufferedEndCurrentTimeCount: 0
})
const addBufferedEndCurrentTimeCount = throttle(5000, () => {
  videoStageStateData.bufferedEndCurrentTimeCount += 1
})
onBeforeUnmount(() => {
  emits('videoStageState', {
    chapterId: props.chapterInfo.chapterId,
    ...videoStageStateData,
    leaveCurrentTime: videoInstance.value.currentTime(),
    startDate: startDate.value,
    endDate: Math.round(new Date().getTime() / 1000)
  })
  videoInstance.value.pause && videoInstance.value.pause()
  videoInstance.value.dispose && videoInstance.value.dispose()
})

</script>

<style lang="less" scoped>
.videoWrap {
  width: 100%;
  height: 100%;
  background-color: #0F0F0F;
  position: relative;

  :deep(.video-js) {
    width: 100%;
    height: 100% !important;
  }
}

/*播放按钮设置成宽高一致，圆形，居中*/
.vjs-custom-skin {
  :deep(.vjs-error-display) {
    display: none !important;
  }

  :deep(.vjs-loading-spinner) {
    display: none !important;
  }

  :deep(.vjs-poster) {
    display: none !important;
  }
}

.vjs-custom-poster {
  :deep(.vjs-poster) {
    display: inline-block !important;
  }
}
</style>
