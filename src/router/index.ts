// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// 引入你的组件
import Home from '../components/Home.vue'
import LaunchScreen from '../components/LaunchScreen.vue'

const routes = [
  {
    path: '/',
    name: 'LaunchScreen',
    component: LaunchScreen
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
