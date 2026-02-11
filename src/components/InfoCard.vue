<template>
  <article class="info-card" data-cy="house-card">
    <router-link v-if="to" :to="to" class="cover-link" data-cy="house-link">
      <!-- <router-link>：Vue Router 提供的元件，用來做 SPA 的頁面切換。 -->
        <!-- :to="to"：to 是從 props 傳進來的路由資訊 -->
      <img v-if="cover" :src="cover" :alt="title" class="cover" />
      <!-- v-if="to"：有傳 to 才顯示這個 <router-link>。如果沒有 to，整個封面區塊就不出現。 -->
        <!-- <img v-if="cover" ...>：
          v-if="cover"：有傳圖片網址時才顯示圖片。
          :src="cover"：綁定圖片網址。
          :alt="title"：替代文字用標題，對 SEO 和無障礙較好。
          class="cover"：對應下面 CSS，控制大小、裁切方式。 -->
    
    <div class="body" data-cy="house-card">
      <h3 class="title">
        <router-link v-if="to" :to="to">{{ title }}</router-link>
        <!-- v-if="to"：如果有傳 to 進來，標題就變成一個可點擊的路由連結。 -->
        <span v-else>{{ title }}</span>
        <!-- v-else：如果沒有 to，就改用 <span> 單純顯示文字，不會導頁。 -->
      </h3>
      <p v-if="meta" class="meta">{{ meta }}</p>
      <ul v-if="bullets && bullets.length" class="bullets">
        <!-- 要同時滿足「有傳入 bullets」且「陣列長度 > 0」才顯示。避免陣列是空的還顯示一個空的 <ul>。 -->
        <li v-for="(b, i) in bullets" :key="i">{{ b }}</li>
        <!-- 迴圈渲染 bullets 陣列中的每一個項目（例如：「學區生活圈」、「近捷運」、「24H 管理」…）。b 是每一項文字，i 是 index（0,1,2,...）。 -->
        <!-- Vue 用 key 來追蹤每個 <li>，避免重排時出錯。這裡用 index 當 key 是可接受的做法（因為只是一份短列表）。 -->
      </ul>
      <p v-if="price" class="price">{{ price }}</p>
      <slot/>
      <!-- slot 是「插槽」，意思是父元件可以在 <InfoCard> 裡面塞額外內容。 -->
    </div>
    </router-link>
  </article>
</template>

<script setup>// 定義可以從外面傳進來的參數
defineProps({
  cover: { type: String, default: '' },
  title: { type: String, default: '' },
  bullets: { type: Array, default: () => [] },
  // 預設值是 () => []：
  // 注意這裡是「函式回傳一個新陣列」，避免多個元件實例共用同一個陣列（這是 Vue 的慣例）。
  meta: { type: String, default: '' },
  price: { type: String, default: '' },
  to: { type: [String, Object], default: '' }
})

</script>

<style scoped>
.info-card { 
  border: 1px solid #eee; 
  border-radius: 12px; 
  overflow: hidden; 
  background:#fff; 
}
.cover-link { 
  display: block; 
}
.cover {
  width: 100%; 
  height: 160px; 
  object-fit: cover; 
}
.body {
  padding: 12px; 
}
.title {
  margin: 0 0 .25rem 0; 
  font-size: 1.1rem; 
}
.meta {
  color:#666; 
  font-size: .9rem; 
  margin: .25rem 0 .5rem; 
}
.bullets {
  display: flex;
  flex-wrap: wrap;   /* 讓每個 bullet 橫向排，必要時換行 */
  gap: 6px 10px;
  padding: 0;
  margin: 8px 0 0;
  list-style: none;
}
.bullets li {
  white-space: nowrap;     /* 讓它不要一字一行 */
  word-break: keep-all;    /* 中文不要拆成單字 */
}
.price {
  font-weight: 400; 
  margin-top: .25rem; 
}
</style>
