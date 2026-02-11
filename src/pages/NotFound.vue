<template>
  <main class="nt">
    <h1>404</h1>
    <p>啊哦，這個頁面不存在。</p>
    <router-link to="/" class="back">回首頁</router-link>
  </main>
</template>

<script setup></script>

<style scoped>
.nt {
  margin: 250px 0;
  display: grid;
  place-items: center;
  gap: 12px;
  text-align: center;
}
.back {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid #333;
  text-decoration: none;
}
</style>
