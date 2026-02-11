import { createApp } from 'vue'
//從 vue 這個套件裡面「解構匯入」createApp 這個函式。 
// createApp 是 Vue 3 的核心 API，用來建立一個 Vue 應用程式的實例。
    //「我要開一個新的 Vue App，先把 Vue 官方提供的 createApp 工具拿進來用。」

import App from './App.vue'
// 從你專案裡的 App.vue 檔案匯入「根元件」（Root Component）。
// App 這個變數就代表 App.vue 那整個元件物件。
    // 以 App.vue 當最外層框架，所有頁面都包在它裡面

import router from './router'
// 從 ./router/index.js（或 ./router 資料夾底下的預設檔案）匯入 Vue Router 實例。
// 通常在 router/index.js 裡
// 對應網址 /、/login、/info、/house/:slug 等；
    // 控制 <router-view> 顯示哪個頁面元件。

import store from './store/authStore'   
// 匯入你定義好的 Vuex 狀態管理 store。
    // 整個網站共享的資料倉庫（例如：登入 token、使用者資料、是否已登入、購物車、收藏房屋…）。

const app = createApp(App)
// 使用剛剛引入的 createApp 函式來建立一個 Vue 應用程式實例。
// 並且把 App（也就是 App.vue）設為「根元件」。
// app 現在是一個 Vue 應用的「本體」，你後面可以：
// 幫它加插件（app.use(...)）
// 最後把它掛到 HTML 上（app.mount(...)）。
    // 「創建一個以 App.vue 為主畫面的 Vue 應用。」

app.use(router)

// 把 Vue Router 註冊到這個 Vue 應用裡。
// 這樣你在元件裡才可以用：
// <router-view />、<router-link />   
// this.$router（程式導航 push/back）
// this.$route（拿現在路徑、參數）
    // 如果你沒有 app.use(router)，
    // 你在 App.vue 放 <router-view> 會完全無效。

app.use(store)
// 把 Vuex store 註冊進這個 App。
// 這樣所有元件才能用：
// this.$store.state.xxx
// this.$store.commit('mutationName')
// this.$store.dispatch('actionName')
    // 你現在用來管理「登入狀態」、「localStorage token」就是靠這個 store。

// 超重要（跟你的登入/保持登入有關）
store.dispatch('restoreAuth')
    //「網站一載入，就先呼叫 Vuex 裡的 restoreAuth 這個 action，幫我把 localStorage 裡的登入資訊讀回來。」
// 呼叫 Vuex 的 action 'restoreAuth'
// 讓它：
    // 檢查 localStorage 裡有沒有之前登入留下的 token / user 資訊
    // 如果有，就把它存回 Vuex 的 state 裡（例如 state.isAuthenticated = true）
    // 讓使用者重新整理頁面時，不會突然變成登出狀態

//「請把這個 app（也就是整個 Vue 應用）掛載到 HTML 裡的 id="app" 那個元素上。」
app.mount('#app')
// mount('#app') 做的事就是：
// 把 <div id="app"></div> 裡的內容，變成由 Vue 接管，
// 然後用 App.vue 開始渲染整個畫面。
    // 沒有這行，你的畫面完全不會顯示任何 Vue 元件。





// 1. 載入 Vue 的 createApp，再載入專案的根元件 App.vue。

// 2. 載入路由設定（router）跟 Vuex 狀態管理（store）。

// 3. 用 createApp(App) 建立一個 Vue 應用實例。

// 4. 把 router、store 掛進這個應用，讓整個 App 都有路由和共享狀態可以用。

// 5. 在畫面真正掛載之前，先 dispatch('initAuth')，從 localStorage 把登入狀態載回來（例如 token、是否登入）。

// 6. 最後 mount('#app')，把整個 Vue App 掛載到 HTML 上，開始顯示畫面。