<script setup>
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
let tempImages = reactive([])

try {
    axios.get(`https://generative-image-a-i-express-40t73jy4w.vercel.app/temp-urls`).then((json) => {
      Object.assign(tempImages, [json.data])
     console.log(tempImages)
    //   console.log(json.data[0].url)
    });
  } catch (err) {
    console.error(err);
  }

console.log(tempImages, 'tacos')
</script>

<template>
    <div v-for="tempUrl in tempImages[0] ">
        <img :src="`${tempUrl.url}`" alt="">
    </div>
</template>

<style scoped>

</style>
