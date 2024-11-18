<script setup>
import { ref } from "vue";
import { getCurrentInstance } from 'vue';
import axios from "axios";

let imageOne ;
let imageTwo ;
let imageOneKey = ref(0)
let imageTwoKey = ref(0)
let imageOneUrl = ref('');
let imageTwoUrl = ref('');
let editPrompt = ref("");
let image_url = ref("");

const prepareImageOne = (event) => {
  imageOne = event.target.files[0];
  imageOneUrl.value = URL.createObjectURL(event.target.files[0])
  imageOneKey.value = 1
  console.log(image)
};

const prepareImageTwo = (event) => {
  imageTwo = event.target.files[0];
  imageTwoUrl.value = URL.createObjectURL(event.target.files[0])
  const instance = getCurrentInstance();
  instance.proxy.forceUpdate();
  imageTwoKey.value = 1
  console.log(imageTwo)
};

const sendImages = async () => {
    let descr = editPrompt.value;
    const formData = new FormData();
    formData.append("imageOne", imageOne);
    formData.append("imageTwo", imageTwo);
    formData.append("prompt", descr)
    console.log(descr)
    try {
      await axios
        .post(`http://generative-image-a-i-express-40t73jy4w.vercel.app/edit-openai/${descr}`, formData)
        .then((json) => {
          image_url.value = json.data.imageUrl;
          console.log(image_url);
        });
    } catch (error) {
      console.error("Error uploading image: ", error);
  }
};
</script>

<template>
  <div>
    <div className="flex flex-col justify-center items-center pt-4 pb-4">
      <div class="section-container">
        <div class="upload">
          <h1 className="text-[#21211D] pt-4 pb-4">Please upload image:</h1>
          <input className="text-[#21211D] pt-4 pb-4" type="file" name="imageOne" @change="prepareImageOne" />
       </div>
        <img class="image" :key="imageOneUrl" :src="imageOneUrl">
      </div>
      <div class="section-container">
        <div class="upload">
          <h1 className="text-[#21211D] pt- 4 pb-4">Please upload masked image:</h1>
          <input className="text-[#21211D] pt-4 pb-4" type="file" name="imageTwo" @change="prepareImageTwo" />
        </div>
        <img class="image" :key="imageTwoUrl" :src="imageTwoUrl">
      </div>
      <textarea className="pt-4 pb-4" v-model="editPrompt" placeholder="Enter a prompt" />
      <button className="text-[#21211D] rounded-md pt-4 pb-4" @click="sendImages()">Image</button>
    </div>
    <div>
      <img :src="image_url" />
    </div>
  </div>
</template>

<style scoped>
  .image {
    height: 100px;
    width: auto;
  }

  .section-container {
    display: flex;
    flex-direction: row;
  }

  .upload {
    display: flex;
    flex-direction: column;

  }



</style>
