<template>
  <router-view/>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { AppModule } from '@/store/modules/app'
import { DeviceModule } from '@/store/modules/device'
import { ChaptersModule } from '@/store/modules/chapters'
import { EAutoAdd } from '@/types/common.interface'

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

