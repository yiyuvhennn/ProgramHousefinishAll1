<!-- src/pages/HouseDetail.vue -->
<template>
  <section class="container py-8">
    

    <!-- 有找到房子資料時 -->
    <article v-if="house" class="detail">
      <header class="header">
        <h1 class="title">{{ house.title }}</h1>
        <p class="meta">
          <span>{{ house.city }}</span>
          <span>・{{ house.area }}</span>
          <span>・{{ house.rooms }}</span>
        </p>
      </header>

      <div class="media">
        <img :src="house.image" :alt="house.title" class="cover" />
      </div>

      <section class="content">
        <h2>簡介</h2>
        <p class="desc">{{ house.description }}</p>

        <h2>特色與設施</h2>
        <ul class="features">
          <li v-for="(f, i) in house.features" :key="i">
            {{ f }}
          </li>
        </ul>

        <div class="price">
          參考價格：<strong>{{ house.price }}</strong>
        </div>
        <router-link class="back" to="/">← 返回首頁</router-link>

      </section>
    </article>

    <!-- 沒有找到對應 slug 的房子時 -->
    <article v-else class="notfound">
      <h1>查無此建案</h1>
      <p>請回到首頁重新選擇。</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchHouseBySlug } from "../services/api";
import type { House } from '../typ/house'

// 讀目前網址上的參數 /house/:slug
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const house = ref<House | null>(null)

// 進到頁面時，用 slug 去 API 抓資料
onMounted(async () => {
  house.value = await fetchHouseBySlug(slug.value)
})

watch(
  () => slug.value,
  async (newSlug) => {
    house.value = await fetchHouseBySlug(newSlug);
  },
  { immediate: true }
);
</script>

<style scoped>
.container {
  max-width: 1040px;
  margin: 0 auto;
}
.py-8 {
  padding: 2rem 1rem;
}
.back {
  display: flex;
  justify-content: end;
  
}
.header .title {
  font-size: 2rem;
  margin: 2rem 0 0.5rem 0;
}
.meta {
  color: #666;
  margin-bottom: 1rem;
}
.media .cover {
  width: 100%;
  height: auto;
  border-radius: 12px;
}
.content {
  margin-top: 1rem;
}
.features {
  padding-left: 1.2rem;
}
.price {
  margin-top: 1rem;
  font-size: 1.1rem;
}
.notfound {
  text-align: center;
  padding: 4rem 1rem;
}
</style>
