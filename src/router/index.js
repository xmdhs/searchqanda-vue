import { createRouter, createWebHistory } from 'vue-router'
import Search from '../views/Search.vue'

const routes = [
  {
    path: '/search/s',
    name: 'search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
