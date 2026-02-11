<template>
  <section class="container py-8">
    <h1>編輯建案</h1>

    <p v-if="loading">載入中…</p>

    <template v-else>
      <p v-if="!house">查無此建案</p>

      <form v-else class="form" @submit.prevent="submit">
        <label>slug <input v-model.trim="form.slug" required /></label>
        <label>title <input v-model.trim="form.title" required /></label>
        <label>city <input v-model.trim="form.city" /></label>
        <label>price <input v-model.trim="form.price" /></label>
        <label>area <input v-model.trim="form.area" /></label>
        <label>rooms <input v-model.trim="form.rooms" /></label>
        <label>image <input v-model.trim="form.image" /></label>

        <label>
          features（用逗號分隔）
          <input v-model.trim="featuresText" />
        </label>

        <label>
          description
          <textarea v-model.trim="form.description" rows="5"></textarea>
        </label>

        <div class="actions">
          <button type="submit" :disabled="saving">{{ saving ? '儲存中…' : '儲存' }}</button>
          <router-link :to="`/house/${route.params.slug}`">回詳細頁</router-link>
          <router-link to="/admin/houses">回列表</router-link>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchHouseBySlug, updateHouse } from '../services/api'
import type { House } from '../typ/house'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const error = ref('')

const house = ref<House | null>(null)
const form = ref<Omit<House, 'id'>>({
  slug: '',
  title: '',
  city: '',
  price: '',
  area: '',
  rooms: '',
  features: [],
  description: '',
  image: ''
})

const featuresText = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const h = await fetchHouseBySlug(String(route.params.slug))
    house.value = h
    if (h) {
      form.value = {
        slug: h.slug,
        title: h.title,
        city: h.city,
        price: h.price,
        area: h.area,
        rooms: h.rooms,
        features: h.features,
        description: h.description,
        image: h.image
      }
      featuresText.value = h.features.join(', ')
    }
  } catch (e: any) {
    error.value = e?.message || '載入失敗'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, load, { immediate: true })

async function submit() {
  if (!house.value) return
  saving.value = true
  error.value = ''
  try {
    form.value.features = featuresText.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const updated = await updateHouse(house.value.id, form.value)
    router.push(`/house/${updated.slug}`)
  } catch (e: any) {
    error.value = e?.message || '儲存失敗'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
.form { display: grid; gap: 12px; }
label { display: grid; gap: 6px; }
.actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.error { color: #c00; }
</style>
