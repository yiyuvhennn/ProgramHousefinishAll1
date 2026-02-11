<template>
  <div class="login-page">
    <h1>登入頁面</h1>

    <form class="login-form" @submit.prevent="handleSubmit" >
      <input
        type="text"
        placeholder="帳號"
        v-model="username"
        data-cy="login-username"
      />
      <input
        type="password"
        placeholder="密碼"
        v-model="password"
        data-cy="login-password"
      />

      <!-- 錯誤訊息 -->
      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <button class="button1" type="submit" :disabled="loading" data-cy="login-submit">
        {{ loading ? '登入中…' : '登入' }}
      </button>

      <router-link to="/" class="backhome">回首頁</router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type { RootState } from '../store/types'

const router = useRouter()
const store = useStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  if (!username.value || !password.value) {
    errorMessage.value = '請輸入帳號與密碼'
    return
  }

  loading.value = true
  try {
    await store.dispatch('login', {
      username: username.value,
      password: password.value
    })
    router.push('/')
  } catch (err: any) {
    errorMessage.value = err?.message || '登入失敗，請稍後再試。'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.login-page {
  border: 1px solid #000;
  text-align: center;
  padding: 50px 50px;
  margin-top: 200px;
}

.login-form {
  display: inline-block;
  height: 400px;
  margin-top: 50px;
}

.login-form input {
  display: block;
  margin: 10px auto;
  padding: 8px;
  width: 200px;
}

.login-form .button1 {
  margin-top: 20px;
  padding: 8px 20px;
  background-color: #222;
  color: white;
  border: none;
  cursor: pointer;
}
.backhome{
  border: 1px solid #000;
  display: block;
  margin-top: 50px;
}

</style>
