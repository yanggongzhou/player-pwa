<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png">
    <div v-for="val in list" :key="val.id">
      {{val.title}}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { netTheater } from '@/api/theater'

const list = ref([])

onBeforeMount(() => {
  getTheaterData()
});

const getTheaterData = async () => {
  const { section } = await netTheater()
  list.value = section[1].items
}

</script>
