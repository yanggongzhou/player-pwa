<template>
  <div class="theaterWrap">
    <TheaterSwipe :data-source="bannerList" @bannerClick="toPlayer"/>
    <div class="theater-content" v-for="item in classData" :key="item.id">
      <template v-if="item.children.length > 0">
        <div class="theater-content_title">
          {{ item.class_name }}
        </div>
        <div class="theaterContent">
          <div class="theater-item" v-for="val in item.children" :key="val.id" @click="toPlayer(val.id)">
            <img :src="val.cover_url" alt="" @error="imgError">
            <p>{{val.title}}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { netApplet, netClass } from '@/api/theater'
import { imgError } from '@/utils/imgError'
import { useRouter } from 'vue-router'
import TheaterSwipe from '@/views/theater/swiper/TheaterSwipe.vue'
import { IClassListItem, IIndexContent } from '@/types/theater.interface'
const router = useRouter();
const bannerList = ref<IIndexContent[]>([]);
const classData = ref<IClassListItem[]>([])

onBeforeMount(() => {
  initTheaterData()
});

const toPlayer = (bookId?: string) => {
  router.push({ name: 'player', query: { bookId } })
}

const getTheaterData = async () => {
  if (classData.value.length > 0) {
    const classIds = classData.value.map(val => val.id);
    const list = await netClass(classIds.slice(0, 3).join(','));
    classData.value = classData.value.map(val => {
      const items = list.filter(li => li.class_id === val.id)
      return {
        ...val,
        children: [...items]
      }
    });
  }
}

const initTheaterData = async () => {
  classData.value = [];
  const { Applet, Index = [], Class = [] } = await netApplet()
  bannerList.value = Index.map(val => JSON.parse(val.content) as IIndexContent);
  classData.value = Class.map(val => ({ ...val, children: [] }));
  await getTheaterData()
}
</script>

<style lang="less" scoped>
.theaterWrap {
  overflow-y: auto;
  padding: 0.2rem 0.3rem;
  .theater-content {
    padding: 0.2rem 0.1rem;
    .theater-content_title {
      font-size: 0.3rem;
      font-weight: 600;
      color: #FFFFFF;
      text-shadow: 0 0.02rem 0.06rem rgba(0, 0, 0, 0.4);
    }
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
    margin-bottom: 0.2rem;
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
