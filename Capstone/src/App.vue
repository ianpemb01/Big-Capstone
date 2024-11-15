<script setup>
import { RouterView, useRoute } from "vue-router";

const router = useRoute();
</script>

<template>
  <nav className="h-20 w-full pt-6 bg-[#21211D] border-b-8 border-black">
    <div className="h-full flex flex-row space-x-4 items-center px-2 justify-between">
      <div className="flex flex-row items-center">
      <button @click="$router.push('/')">
        <img src="src/assets/Logo.png" alt="" className="h-10 px-4">
    </button>
      <h1 className="text-3xl font-extrabold text-slate-300" @click="$router.push('/')">GRID.AI</h1>
    </div>
      <!-- <p @click="$router.push(`/editpost/${items._id}`)">Edit Post</p> -->
      <div className="space-x-2 pt-2">
        <button
          className="bg-[#F3F2EE] rounded-md min-w-max text-sm py-1 px-4"
          @click="$router.push('/gallery')"
        >
          Galleries
        </button>

        <button
          className="bg-[#F3F2EE] rounded-md min-w-max text-sm py-1 px-4"
          @click="$router.push('/ask-openai')"
        >
          Generate an Image
        </button>

        <button
          className="bg-[#F3F2EE] rounded-md min-w-max text-sm py-1 px-4"
          @click="$router.push('/upload')"
        >
          Upload an Image
        </button>

        <button
          className="bg-[#F3F2EE] rounded-md min-w-max text-sm py-1 px-4"
          @click="$router.push('/temp-urls')"
        >
          Temporary Image URLS
        </button>

        <button
          className="bg-[#F3F2EE] rounded-md min-w-max text-sm py-1 px-4"
          @click="$router.push('/edit-openai')"
        >
          Edit an Image
        </button>
      </div>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped></style>
