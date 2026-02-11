<!-- src/pages/HomePage.vue -->
<template>
  <section class="main">
    <div class="jumbotron">
      <div class="mask-dark"></div>
      <div class="container"></div>
    </div>

    <section class="container my-10">
      <h2 class="section-title">熱門建案</h2>

      <p v-if="loading">載入中…</p>
      <p v-else-if="error">{{ error }}</p>

      <div v-else class="grid">
        <div v-for="h in houses" :key="h.slug">
          <InfoCard
            :cover="h.image"
            :title="h.title"
            :meta="`${h.city}・${h.area}・${h.rooms}`"
            :bullets="h.features"
            :price="h.price"
            :to="`/house/${h.slug}`"
          />

          <div v-if="isAuthenticated" class="admin-actions">
            <router-link :to="`/admin/houses/${h.slug}/edit`">編輯</router-link>
            <button
              type="button"
              @click="deleteBySlug(h.slug)"
              :disabled="deletingSlug === h.slug"
            >
              {{ deletingSlug === h.slug ? '刪除中…' : '刪除' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import InfoCard from '../components/InfoCard.vue'
import type { House } from '../typ/house'
import { fetchHouses, searchHouses, fetchHouseBySlug, deleteHouse } from '../services/api'

// 從外面接收搜尋字（你原本的）
const props = defineProps<{ searchKeyword: string }>()

// 狀態
const houses = ref<House[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const store = useStore()
const isAuthenticated = computed(() => store.getters.isAuthenticated)

const deletingSlug = ref<string | null>(null)


// 載入全部建案
async function loadAllHouses(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    houses.value = await fetchHouses()
  } catch {
    error.value = '資料載入失敗，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// 依關鍵字搜尋
async function doSearch(keyword: string): Promise<void> {
  loading.value = true
  error.value = null
  try {
    houses.value = await searchHouses(keyword)
  } catch {
    error.value = '資料載入失敗，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// 刪除指定 slug 的建案
async function deleteBySlug(slug: string) {
  const ok = window.confirm('確定要刪除嗎？刪除後無法復原。')
  if (!ok) return

  deletingSlug.value = slug
  error.value = null

  try {
    const house = await fetchHouseBySlug(slug)
    if (!house) {
      alert('找不到該建案，無法刪除。')
      return
    }

    await deleteHouse(house.id)
    await loadAllHouses()
  } catch (e: any) {
    // 把後端回傳的 message 顯示出來（超重要）
    error.value =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      '刪除失敗'
  } finally {
    deletingSlug.value = null
  }
}


// 監聽搜尋字：一進頁面就先載入一次
watch(
  () => props.searchKeyword,
  async (newVal: string) => {
    const kw = (newVal ?? '').trim()
    if (!kw) {
      await loadAllHouses()
    } else {
      await doSearch(kw)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.admin-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  align-items: center;
}


</style>
