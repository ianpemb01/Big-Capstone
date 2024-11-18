<script setup>
import { ref } from "vue";
import axios from "axios";
import uploadGeneratedImageComponent from "@/components/uploadGeneratedImageComponent.vue";

let prompt = ref("");
let image_url = ref("");

const generateImage = () => {
  console.log(prompt);
  let descr = prompt.value;
  axios.post("http://generative-image-a-i-express-40t73jy4w.vercel.app/ask-openai", {
      prompt: descr,
    })
    .then((json) => {
      image_url.value = json.data.imageUrl;
      console.log(image_url.value);
      storeURL(image_url.value)
    });
};

async function storeURL(){
 if(image_url.value != ""){

let options = {
    method: "POST",
    body: JSON.stringify({
        url: image_url.value,
        timeCreated: Date.now(),
        prompt: prompt.value
    }),
    headers: {
  "Accept": "application/json",
  "Content-Type": "application/json",
    }
}
fetch('https://generative-image-a-i-express-40t73jy4w.vercel.app/newImage', options)
.then (response =>{
    return response.json()
})
.then(newPost=> {
    console.log(newPost)
})
 }else{
  console.log("URL field is empty.")
  return;
 }
}
</script>

<template>
  <div v-if="image_url == ''">
    <div className="flex flex-col space-y-4 justify-center items-center pt-4">
      <textarea className="w-80 h-56" v-model="prompt" placeholder="Enter a prompt" />
      <button className="bg-gray-200 rounded-md pb-4" @click="generateImage">Generate Image</button>
    </div>
    <div>
      <img :src="image_url" />
    </div>
  </div>
  <div v-else>
    <div className="flex flex-col space-y-4 justify-center items-center pt-4 pb-4">
      <input v-model="prompt" placeholder="Enter a prompt" />
      <button className="bg-gray-200 rounded-md" @click="generateImage">Generate Image</button>
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
