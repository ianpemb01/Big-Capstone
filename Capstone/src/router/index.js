import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GalleryView from '@/views/GalleryView.vue'
import UploadImageView from '@/views/UploadImageView.vue'
import SingleImageView from '@/views/SingleImageView.vue'
import POSTCreateImageView from '@/views/POSTCreateImageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadImageView
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView
    },
    {
      path: '/image/:key',
      name: 'image',
      component: SingleImageView
    },
    {
      path: '/ask-openai',
      name: 'ask-openai',
      component: POSTCreateImageView
    }
  ]
})

export default router
