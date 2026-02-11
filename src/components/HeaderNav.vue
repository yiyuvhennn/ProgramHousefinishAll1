<!-- src/components/HeaderNav.vue -->
<template>
  <header class="header">
    <div class="navbar">
      <div class="container">
        <!-- 左邊 LOGO / 品牌 -->
        <router-link to="/" class="brand" @click="handleLogoClick">
          <!-- @click="handleLogoClick"：這是這支元件的 methods 之一。
          功能：除了回首頁以外，順便把搜尋列清空、把 search 事件 emit 出去（關鍵字變成空字串），
          等於「回到初始狀態」。 -->
          <h1>逢甲房屋交易</h1>
        </router-link>

        <!-- 右上 nav1：登入 + 搜尋欄 -->
        <ul class="nav1">
          <!-- 尚未登入：顯示「登入」 -->
          <li class="nav-item" v-if="!isAuthenticated">
            <!-- v-if="!isAuthenticated"：
            isAuthenticated 是從 Vuex 的 getters 來的（下面 script 有）。
            false → 沒登入 → 顯示這個 li。 -->
            <router-link to="/login" class="nav-link">登入</router-link>
          </li>

          <!-- 已登入：顯示使用者名稱 + 登出 -->
          <li class="nav-item nav-user" v-else>
            <span class="nav-username">您好，{{ userName }}</span>
            <button class="nav-logout" @click="handleLogout">登出</button>
            <!-- @click="handleLogout"：
            呼叫 methods 裡的 handleLogout，裡面會去呼叫 Vuex 的 logout action，
            然後 this.$router.push('/') 回首頁。 -->
          </li>

          <!-- 🔍 搜尋欄 -->
          <li class="nav-item nav-search">
            <input
              v-model="localKeyword"
              type="text"
              class="nav-search-input"
              placeholder="輸入關鍵字（地區、建案名稱、房型…）"
              @keyup.enter="emitSearch"
              data-cy="search-input"
            />
            <!-- 整體包在 <li class="nav-item nav-search"> 裡。
            <input v-model="localKeyword">：localKeyword 是 data 裡的變數。
            v-model 會自動把輸入框的內容跟 localKeyword 綁定：使用者打字 → localKeyword 更新。
            你在程式裡改 localKeyword → 輸入框顯示也會跟著更新。
            placeholder="輸入關鍵字（地區、建案名稱、房型…）"：提示使用者可以輸入哪些關鍵字。
            @keyup.enter="emitSearch"：按下 Enter 時觸發 emitSearch()，等於「按 Enter 也可以搜尋」。 -->
            <button class="nav-search-btn" @click="emitSearch" data-cy="search-btn">
              搜尋
            </button>
            <button
              v-if="localKeyword"
              class="nav-search-clear"
              @click="clearSearch"
              title="清除搜尋"
            >
            <!-- v-if="localKeyword"：
            只有當輸入框裏有東西時才顯示 X。
            @click="clearSearch"：按 X → 呼叫 clearSearch()：把 localKeyword 清成空字串；
            再 $emit('search', '')，通知父元件「清空搜尋」。 -->            
            x <!-- 為清除按鈕 -->
            </button>
          </li>
          <!-- ✅ 管理按鈕：登入才顯示 -->
          <li class="nav-item nav-admin" v-if="isAuthenticated">
            <router-link class="nav-link" to="/admin/houses/new">新增</router-link>

            <!-- ✅ 只有在建案詳細頁才顯示 -->
            <button
              v-if="showDetailActions"
              class="nav-link"
              type="button"
              @click="goEditCurrent"
            >
              編輯
            </button>

            <button
              v-if="showDetailActions"
              class="nav-link danger"
              type="button"
              @click="deleteCurrent"
            >
              刪除
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { fetchHouseBySlug, deleteHouse } from '../services/api'

export default {
  name: 'HeaderNav',

  props: {
    searchKeyword: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      localKeyword: this.searchKeyword,
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),

    userName() {
      return this.currentUser && this.currentUser.username
        ? this.currentUser.username
        : '使用者'
    },

    // ✅ 只有在建案詳細頁才顯示「編輯/刪除」
    showDetailActions() {
      return this.isAuthenticated && this.$route.name === 'HouseDetail'
    },
  },

  watch: {
    searchKeyword(newVal) {
      this.localKeyword = newVal
    },
  },

  methods: {
    ...mapActions(['logout']),

    emitSearch() {
      this.$emit('search', this.localKeyword.trim())
    },

    clearSearch() {
      this.localKeyword = ''
      this.$emit('search', '')
    },

    handleLogoClick() {
      this.localKeyword = ''
      this.$emit('search', '')
    },

    async handleLogout() {
      await this.logout()
      this.$router.push('/')
    },

    goEditCurrent() {
      const slug = this.$route.params.slug
      if (!slug) return
      this.$router.push(`/admin/houses/${slug}/edit`)
    },

    async deleteCurrent() {
      const slug = this.$route.params.slug
      if (!slug) return

      const ok = window.confirm('確定要刪除這筆建案嗎？刪除後無法復原。')
      if (!ok) return

      const house = await fetchHouseBySlug(String(slug))
      if (!house) {
        alert('查無此建案，無法刪除。')
        return
      }

      await deleteHouse(house.id)
      alert('刪除成功')
      this.$router.push('/admin/houses')
    },
  },
}
</script>


<style scoped>
.header {
  background: #ffffff;
  border-bottom: 1px solid #eee;
}
.navbar {
  padding: 8px 0;
}
.container {
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  text-decoration: none;
  color: #333;
}
.brand h1 {
  font-size: 20px;
  margin: 0;
}
.nav1 {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}
.nav-item {
  margin-left: 12px;
}
.nav-link {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}
.nav-search {
  display: flex;
  align-items: center;
}
.nav-search-input {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 220px;
}
.nav-search-btn,
.nav-search-clear {
  margin-left: 4px;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
}
.nav-search-btn:hover,
.nav-search-clear:hover {
  background: #e5e5e5;
}
.nav-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-username {
  font-size: 14px;
  color: #ddd;
  padding-right: 20px;
}

.nav-logout {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
}

.nav-logout:hover {
  background: #e5e5e5;
} 

</style>
