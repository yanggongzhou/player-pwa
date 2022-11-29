<template>
  <div class="theaterWrap">
    <h1 class="theater-title" @click="toPlayer">跳转至播放器</h1>
    <h1 class="theater-title">剧场</h1>
    <div class="theaterContent">
      <div class="theater-item" v-for="val in list" :key="val.id" @click="toPlayer(val.id)">
        <img :src="val.img_url[0]" alt="">
        <p>{{val.title}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { netTheater } from '@/api/theater'
import { useRouter } from 'vue-router'

const list = ref([])

onBeforeMount(() => {
  getTheaterData()
});
const router = useRouter();
const toPlayer = (bookId?: string) => {
  router.push({ name: 'player', query: { bookId } })
}

const getTheaterData = async () => {
  const { section } = await netTheater()
  list.value = section[1].items.filter(sec => sec.bookType === 4)
}
</script>

<style lang="less" scoped>
.theaterWrap {
  padding: 0.2rem 0.4rem;
  .theater-title {
    margin-top: 0.2rem;
    font-size: 0.4rem;
    font-weight: 500;
    color: #FFFFFF;
    text-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.4);
  }
}
.theaterContent {
  margin-top: 0.2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 0.2rem;
  .theater-item {
    width: 100%;
    font-size: 0.2rem;
    img {
      width: 100%;
      height: 3rem;
      border-radius: 0.08rem;
    }
    p {
      margin-top: 0.08rem;
      font-size: 0.26rem;
      font-weight: 500;
      color: #FFFFFF;
      text-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.4);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

</style>
