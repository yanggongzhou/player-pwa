<template>
  <div class="loading-wrap" :class="duration === 0 ? 'loading-wrap2' : ''">
    <div class="loading-spinner">
      <div class="loading-circle">
        <div class="loading-circle-item">
          <div class="loading-color-item"/>
        </div>
      </div>
      <div class="loading-circle2">
        <div class="loading-circle-item">
          <div class="loading-color-item2"></div>
        </div>
      </div>
      <div class="loading-circle3">
        <div class="loading-circle-item">
          <div class="loading-color-item3"></div>
        </div>
      </div>
    </div>
    <div
      v-for="item in message"
      :key="item"
      class="loading-normal_txt"
      :class="animation && 'animation_txt'">{{ item }}
    </div>
  </div>
</template>
<script lang="ts" setup>

defineProps({
  message: {
    type: Array,
    default: () => []
  },
  animation: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0,
    required: true
  }
})
</script>

<style lang="less" scoped>
.loading-wrap2 {
  height: 100% !important;
}
.loading-normal_txt {
  color: #FFFFFF;
  font-size: 0.3rem;
  font-weight: 600;
}
.animation_txt {
  animation-name: textShow;
  animation-duration: 600ms;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-delay: 2s;
  opacity: 0;
}
</style>
