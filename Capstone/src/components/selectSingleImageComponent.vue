<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import DeleteImageComponent from "./deleteImageComponent.vue";

const route = useRoute();
const image = ref("");
console.log(route.params);
try {
  axios
    .get(`https://generative-image-a-i-express-15zxlmc11.vercel.app/image/${route.params.key}`)
    .then((json) => {
      image.value = json.data;
      console.log(json.data);
    });
} catch (err) {
  error.value = "Error fetching images from the server";
  console.error(err);
}
</script>

<template>
  <div className="flex justify-center items-center py-4">
    <div className="flex border-2 p-2 rounded-md w-[700px] h-[700px]">
        <img className="max-h-[700px] max-w-[700px] h-full w-full" :src="image" />
    </div>
    <div>
        <DeleteImageComponent></DeleteImageComponent>
    </div>
  </div>
</template>

<style scoped></style>
