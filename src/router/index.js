import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CategoryManager from '../views/CategoryManager.vue'
import CategoryDetail from '../views/CategoryDetail.vue'
import PostManager from '../views/PostManager.vue'
import PostDetail from '../views/PostDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryManager
  },
  {
    path: '/categories/:id',
    name: 'CategoryDetail',
    component: CategoryDetail
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostManager
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

