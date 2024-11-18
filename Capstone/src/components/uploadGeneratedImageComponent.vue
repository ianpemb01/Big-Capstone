<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps(["url"]);
let imageKey = ref('')

const sendImage = async () => {
  let url = props.url;
  if (url) {
    const formData = new FormData();
    formData.append("image", url);
    console.log(props.url, 'burrito');
    try {
      const response = await axios.post(
        "http://generative-image-a-i-express-40t73jy4w.vercel.app/save-image",
        { URL: url,
          Key: imageKey.value
        }
      );
      console.log(response.data, 'taco');
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  }
};
</script>

<template>
  <div className="flex flex-col space-y-4 justify-center items-center pt-4">
    <input type="text" default="Image name"  v-model="imageKey">
  <button className="bg-gray-200 rounded-md" @click="sendImage">Save Image</button>
</div>
</template>

<style scoped></style>
