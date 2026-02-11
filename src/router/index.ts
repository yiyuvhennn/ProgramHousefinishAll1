import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/authStore'


const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('../pages/HomePage.vue') 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../pages/LoginPage.vue') 
  },
  { 
    path: '/house/:slug', 
    name: 'HouseDetail', 
    component: () => import('../pages/HouseDetail.vue') 
  },

  // ✅ 下面三個是你 HeaderNav 點了會去的路由（登入才可）
  {
    path: '/admin/houses',
    name: 'AdminHouseList',
    component: () => import('../pages/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/houses/new',
    name: 'HouseCreate',
    component: () => import('../pages/HouseCreatePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/houses/:slug/edit',
    name: 'HouseEdit',
    component: () => import('../pages/HouseEditPage.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import('../pages/NotFound.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 未登入就丟去 Login
router.beforeEach((to, _from, next) => {
  if (to.meta?.requiresAuth && !store.getters.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

export default router
