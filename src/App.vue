<template>
  <router-view/>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { AppModule } from '@/store/modules/app'
import { IChapterInfo } from '@/types/player.interface'
import { DeviceModule } from '@/store/modules/device'
import { ChaptersModule } from '@/store/modules/chapters'
import { EAutoAdd } from '@/types/common.interface'
import { netHiveLog, netIP } from '@/api/clientLog'

// 章节预加载
const AndWebPre = (chapterInfo: IChapterInfo) => {
  console.log('-----------AndWebPre 章节预加载数据返回-----------', chapterInfo)
  ChaptersModule.RefreshChapterAllList(chapterInfo.chapterId)
  netHiveLog('AndWebPre', { chapterId: chapterInfo.chapterId, chapterName: chapterInfo.chapterName })
  if (DeviceModule.isPrevRefresh) {
    AppModule.RefreshVideoSource({
      bookInfo: AppModule.bookInfo, chapterInfo
    })
    DeviceModule.SetIsPrevRefresh(false)
  } else {
    AppModule.AddSwipeList(chapterInfo)
  }
}
// 选择对应章节
const AndWebSelect = (chapterInfo: IChapterInfo) => {
  console.log('-----------AndWebSelect 选择章节返回数据-----------', chapterInfo)
  netHiveLog('AndWebSelect', { chapterId: chapterInfo.chapterId, chapterName: chapterInfo.chapterName })
  AppModule.RefreshSelectSource({
    bookInfo: AppModule.bookInfo, chapterInfo
  })
}

// 安卓手势返回 & 手机底部按钮返回
const AndWebQuit = () => {
  console.log('-----------AndWebQuit 手势返回 & 手机底部按钮返回-----------')
  netHiveLog('AndWebQuit', { action: 3, autoAdd: AppModule.bookInfo.autoAdd })
  if (ChaptersModule.isCatalogPopupVisible) {
    ChaptersModule.SetIsCatalogPopupVisible(false)
    return
  }
  if (AppModule.bookInfo.autoAdd === EAutoAdd.否) {
    DeviceModule.SetIsRetain(true)
  } else {
    DeviceModule.ToLeavePlayer()
  }
}

const onResume = () => {
  console.log('-----------onResume-----------')
}

const updateOnlineStatus = () => {
  DeviceModule.SetIsOnline(true)
  if (AppModule.bookInfo.autoAdd === EAutoAdd.否) {
    ChaptersModule.SetIsShowDrama(true)
  }
  console.log('-----------网络连接成功-----------')
}

const updateOfflineStatus = () => {
  DeviceModule.SetIsOnline(false)
  if (ChaptersModule.isShowDrama) {
    ChaptersModule.SetIsShowDrama(false)
  }
  console.log('-----------网络断开连接-----------')
}

onBeforeMount(() => {
  netIP()
  window.AndWebQuit = AndWebQuit // 安卓手势返回 & 手机底部按钮返回
  window.AndWebPre = AndWebPre as any // 章节预加载
  window.onResume = onResume // H5页面可读时客户端调用
  window.AndWebSelect = AndWebSelect as any // 选择章节数据
  console.log('-----------播放器启动---bookSotre-------', window.bookSotre)
  netHiveLog('app_launch', { action: 1 })
  // 初始化数据
  AppModule.InitVideoSource()
  // 监听网络
  // 网络由异常到正常时触发
  window.addEventListener('online', updateOnlineStatus)
  // 网络由正常到异常触发
  window.addEventListener('offline', updateOfflineStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOfflineStatus)
})
</script>

