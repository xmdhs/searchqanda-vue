import { createRouter, createWebHistory } from 'vue-router'
import Search from '../views/Search.vue'

const routes = [
  {
    path: '/search/s',
    name: 'search',
    component: Search,
    props: route => ({ 
      title: route.query.q + " - 问答版搜索",
      page: route.query.page || 0,
      q: route.query.q || '',
     })
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
