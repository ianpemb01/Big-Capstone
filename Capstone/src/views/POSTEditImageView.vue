<script setup>
import ManipulateImageComponent from '@/components/manipulateImageComponent.vue';
import uploadGeneratedImageComponent from '@/components/uploadGeneratedImageComponent.vue';
</script>

<template>
  <div>
    <ManipulateImageComponent></ManipulateImageComponent>
  </div>
  <div>
      <Suspense>
        <uploadGeneratedImageComponent
          :url="image_url"
        ></uploadGeneratedImageComponent>
      </Suspense>
    </div>
</template>

<style scoped>

</style>