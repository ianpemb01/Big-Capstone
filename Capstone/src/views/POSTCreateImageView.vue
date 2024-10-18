<script setup>
import { ref } from "vue";
import axios from "axios";
import uploadGeneratedImageComponent from "@/components/uploadGeneratedImageComponent.vue";

let prompt = ref("");
let image_url = ref("");

const generateImage = () => {
  console.log(prompt);
  let descr = prompt.value;
  axios
    .post("http://localhost:3000/ask-openai", {
      prompt: descr,
    })
    .then((json) => {
      image_url.value = json.data.imageUrl;
      console.log(image_url.value);
    });
};
</script>

<template>
  <div v-if="image_url == ''">
    <div>
      <input v-model="prompt" placeholder="Enter a prompt" />
      <button @click="generateImage">Generate Image</button>
    </div>
    <div>
      <img :src="image_url" />
    </div>
  </div>
  <div v-else>
    <div>
      <input v-model="prompt" placeholder="Enter a prompt" />
      <button @click="generateImage">Generate Image</button>
    </div>
    <div>
      <img :src="image_url" />
    </div>
    <div>
      <Suspense>
        <uploadGeneratedImageComponent
          :url="image_url"
        ></uploadGeneratedImageComponent>
      </Suspense>
    </div>
  </div>
</template>

<style scoped></style>
