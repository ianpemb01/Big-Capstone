<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps(["url"]);

// const res = await fetch(props.url)
// const blob = await res.buffer('')

// const prepareImage = (event) => {
//     blob.value = event.target.files[0];
// }

const sendImage = async () => {
  let url = props.url;
  if (url) {
    const formData = new FormData();
    formData.append("image", url);
    console.log(props.url);
    try {
      const response = await axios.post(
        "http://localhost:3000/save-image",
        { URL: url }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  }
};
</script>

<template>
  <button @click="sendImage">Save Image</button>
</template>

<style scoped></style>
