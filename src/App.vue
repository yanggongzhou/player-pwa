<template>
  <div id="appWrap">
<!--    <PayPopup/>-->
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
import PayPopup from '@/components/PayPopup.vue'
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { DeviceModule } from '@/store/modules/device'
import { ChaptersModule } from '@/store/modules/chapters'
import { EAutoAdd } from '@/types/common.interface'
import { netLogin } from '@/api/self'
import { UserModule } from '@/store/modules/user'
import { PlayerModule } from '@/store/modules/player'

const updateOnlineStatus = () => {
  DeviceModule.SetIsOnline(true)
  if (PlayerModule.parent_info.autoAdd === EAutoAdd.否) {
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

onBeforeMount(async () => {
  const data = await netLogin()
  UserModule.SetUserInfo(data);
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

