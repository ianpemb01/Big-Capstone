<script setup>
  import {RouterView, useRoute} from 'vue-router';

  const router = useRoute()
</script>

<template>
  <nav className="h-20 w-full pb-2 bg-[#914E56]">
    <div className="h-full flex flex-row space-x-4 justify-center items-center px-2" >
      <!-- <p @click="$router.push(`/editpost/${items._id}`)">Edit Post</p> -->
        <button className="bg-white rounded-md flex-grow min-w-max w-16" @click="$router.push('/gallery')">Gallery</button>

        <button className="bg-white rounded-md flex-grow min-w-max" @click="$router.push('/ask-openai')">Generate an Image</button>

        <button className="bg-white rounded-md flex-grow min-w-max" @click="$router.push('/upload')">Upload an Image</button>
    
  </div>
  </nav>
  <RouterView />
</template>

<style scoped>

</style>
