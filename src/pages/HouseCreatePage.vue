<template>
  <section class="container py-8">
    <h1>新增建案</h1>

    <form class="form" @submit.prevent="submit">
      <label>slug <input v-model.trim="form.slug" required /></label>
      <label>title <input v-model.trim="form.title" required /></label>
      <label>city <input v-model.trim="form.city" /></label>
      <label>price <input v-model.trim="form.price" /></label>
      <label>area <input v-model.trim="form.area" /></label>
      <label>rooms <input v-model.trim="form.rooms" /></label>
      <label>image <input v-model.trim="form.image" placeholder="/img/xxx.jpg" /></label>

      <label>
        features（用逗號分隔）
        <input v-model.trim="featuresText" placeholder="近捷運, 公設齊全, ..." />
      </label>

      <label>
        description
        <textarea v-model.trim="form.description" rows="5"></textarea>
      </label>

      <div class="actions">
        <button type="submit" :disabled="loading">{{ loading ? '新增中…' : '新增' }}</button>
        <router-link to="/admin/houses">取消</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createHouse } from '../services/api'
import type { House } from '../typ/house'

const router = useRouter()
const loading = ref(false)
const error = ref('')

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

const parsedFeatures = computed(() =>
  featuresText.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    form.value.features = parsedFeatures.value
    const created = await createHouse(form.value)
    router.push(`/house/${created.slug}`)
  } catch (e: any) {
    error.value = e?.message || '新增失敗'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
.form { display: grid; gap: 12px; }
label { display: grid; gap: 6px; }
.actions { display: flex; gap: 12px; align-items: center; }
.error { color: #c00; }
</style>
