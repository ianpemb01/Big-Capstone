import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GalleryView from '@/views/GalleryView.vue'
import UploadImageView from '@/views/UploadImageView.vue'
import SingleImageView from '@/views/SingleImageView.vue'
import POSTCreateImageView from '@/views/POSTCreateImageView.vue'
import POSTEditImageView from '@/views/POSTEditImageView.vue'
import TempUrlsView from '@/views/TempUrlsView.vue'

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
    },
    {
      path: '/edit-openai',
      name: 'edit-openai',
      component: POSTEditImageView
    },
    {
      path: '/temp-urls',
      name: 'temp-urls',
      component: TempUrlsView
    }
  ]
})

export default router
