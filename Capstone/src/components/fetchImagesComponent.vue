<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const route = useRouter();
const images = ref([]);
const loading = ref(false);
loading.value = true;
try {
  //   loading.value = true;
  axios.get("https://generative-image-a-i-express-40t73jy4w.vercel.app/gallery").then((json) => {
    console.log({ taco: json.data });
    images.value = json.data;
  });
} catch (err) {
  error.value = "Error fetching images from the server";
  console.error(err);
} finally {
  loading.value = false;
}
console.log(images.key, "tacos");
console.log(images);
</script>

<template>
  <div className="py-2">
    <div className="flex flex-col space-y-4 justify-center items-center">
      <div v-for="(image, index) in images" :key="index">
        <div className="border-2 p-2 rounded-md">
          <div className="w-96 h-96">
            <div v-if="loading">...Loading</div>
            <div v-if="!loading">
              <img
                className="max-h-96 w-full max-w-96 h-full"
                :src="image.url"
                @click="route.push({ path: `/image/${image.Key}` })"
                placeholder="Tacos"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
