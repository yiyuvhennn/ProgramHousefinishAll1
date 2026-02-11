<!-- src/App.vue -->
<template>
  <div id="app">
  <!-- 這是整個 Vue app 的根節點，會掛載到 index.html 裡的 <div id="app"> 上 -->  
    <!-- 上面的導覽列 -->
    <HeaderNav
      :searchKeyword="searchKeyword"
      @search="handleSearch"
    />
<!-- :searchKeyword="searchKeyword"
前面的 : 代表「綁定 JavaScript 變數」，不是字串。
右邊的 searchKeyword 是這個檔案 data() 裡的資料。
也就是說：App.vue 把自己的 searchKeyword 當作 props 傳給 HeaderNav。
用途例如：讓 HeaderNav 的輸入框初始值跟 App 的狀態同步，或在清空時能更新。 -->

<!-- @search="handleSearch"
@search 代表監聽 HeaderNav 子元件發出的 search 事件。
當 HeaderNav 內部執行 this.$emit('search', keyword) 時，就會呼叫這裡的 handleSearch(keyword)。
也就是說：子元件把「關鍵字」丟給父元件（App.vue）。 -->

    <!-- 中間頁面內容 -->
    <router-view :searchKeyword="searchKeyword" />
    <!-- router-view 是 Vue Router 提供的「頁面出口」：你現在在哪個路由（/、/info、/about），它就顯示對應的頁面元件。 -->

    <!-- ⭐ 最下方固定的 Footer -->
    
    <FooterBar />

  </div>
</template>


<script>
import HeaderNav from './components/HeaderNav.vue'
import FooterBar from './components/FooterBar.vue'

export default {// 這是匯出一個 Vue 元件物件，讓這支檔案可以被別人 import。
  name: 'App',
  components: {//告訴 Vue：在這個元件裡可以使用 <HeaderNav /> 和 <FooterBar /> 這兩個子元件。 
    HeaderNav,
    FooterBar  
    // 如果你忘記在這裡註冊，template 裡的 <FooterBar /> 會變成「不明標籤」，不會正常渲染。
  },
  data() {//data() 是元件的「資料狀態」，必須回傳一個物件。 
    return {
      searchKeyword: ''
      // searchKeyword：
      // 初始值是空字串 ''。
      // 用來存現在的搜尋關鍵字。
      // 當它改變時，所有用到它的地方（例如 :searchKeyword="searchKeyword"）都會自動更新。
    }
    // App.vue 有一個「全域搜尋字串」，管控 Header 和中間頁面。
  },
  methods: {//這裡定義了元件的方法。
// handleSearch(keyword)：
// 會在 <HeaderNav @search="handleSearch" /> 被觸發時執行。
// 參數 keyword：
// 來自 HeaderNav 裡的 this.$emit('search', keyword)。 
    handleSearch(keyword) {
      this.searchKeyword = keyword
      // this.searchKeyword = keyword：
      // 把 App.vue 裡的 searchKeyword 更新為最新關鍵字。
      // 由於 searchKeyword 是 reactive（響應式），
      // 下面的 <router-view :searchKeyword="searchKeyword" /> 也會跟著收到新的值，
      // 讓頁面元件可以根據新的關鍵字重新搜尋、重新顯示。
    }
    // 這就是「父層當中央控管搜尋狀態」的做法。
  },
  watch: {//很重要，「自動重置搜尋」的功能。 watch 是 Vue 提供的「監聽某個資料變化」的機制。
    $route(to) {
// 這裡監聽的是 $route：
// $route 是目前的路由物件（例如 path, name, params...）。
// 每次路由改變（換頁）時，這個 watcher 都會被觸發。
      if (to.name === 'Home') {//to 代表「要前往的那個路由物件」。 
        this.searchKeyword = ''
      // 只要你「導航回首頁」，搜尋欄位就會 reset，頁面也可以顯示全部建案。
      // 點左上角 logo → this.$router.push({ name: 'Home' })
      // 因為路由變成 Home → $route watcher 觸發 → 把 searchKeyword 清空 → 頁面重置。
      }
    }
  }
}
</script>


<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>
<!-- 這支 App.vue 負責建立整個網站的外框架：上方是 HeaderNav 導覽列，
 中間用 router-view 顯示各個頁面，下方是固定的 FooterBar。
它用 searchKeyword 這個狀態，串起 Header 的搜尋輸入和中間頁面的資料顯示，
並透過監聽 $route，在回到首頁時自動清空搜尋條件，搭配全局 CSS 把頁面外框的預設邊距移除，確保畫面排版正常。 -->