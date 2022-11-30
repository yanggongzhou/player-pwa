<template>
  <div class="layoutWrap">
    <div class="layoutHeader">剧场(PWA)</div>
    <router-view/>
    <van-config-provider :theme-vars="themeVars">
      <van-tabbar
        v-model="active"
        fixed
        :z-index="999"
        safe-area-inset-bottom
        :border="false"
        :before-change="onBeforeChange"
        placeholder
        @change="onChange">
        <van-tabbar-item
          v-for="val in tabList"
          :key="val.name"
          :name="val.name"
          :icon="val.icon"
          :badge="val.badge || ''"
        >{{val.label}}</van-tabbar-item>
      </van-tabbar>
    </van-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const themeVars = {
  tabbarHeight: '1.2rem',
  tabbarItemFontSize: "0.26rem",
  tabbarItemTextColor: '#7F7F7F',
  tabbarBackgroundColor: '#0F0F0F',
  tabbarItemActiveColor: '#FFFFFF',
  tabbarItemActiveBackgroundColor: '#0F0F0F'
}

const tabList = ref([
  { label: '追剧', name: 'drama', icon: 'like' },
  { label: '广场', name: 'theater', icon: 'wap-home', badge: '3' },
  { label: '我的', name: 'self', icon: 'smile' },
])
const active = ref('theater');
const router = useRouter()
const onChange = (name: string) => {
  console.log('change------>', name)
  router.replace(name)
}
const onBeforeChange = () => {
  return true
}

</script>

<style lang="less" scoped>
.layoutWrap {
  width: 100%;
  height: 100%;
  .layoutHeader {
    height: 1.2rem;
    background-color: #0F0F0F;
    display: flex;
    align-items: center;
    color: #FFFFFF;
    font-size: 0.36rem;
    font-weight: 600;
    padding: 0 0.4rem;
  }
}
</style>
