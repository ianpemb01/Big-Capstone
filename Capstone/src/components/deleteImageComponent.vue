<script setup>
import axios from "axios";
import { useRoute } from "vue-router";

const props = defineProps(["key"]);
const route = useRoute();

const deleteImage = async (key) => {
    try{
        const response = await axios.delete(`https://generative-image-a-i-express.vercel.app/image/delete/${route.params.key}`);
        console.log('Image deleted succesfullly:', response.data);
    } catch(error) {
        console.error('Failed to delete image: ', error)
    }
};
</script>

<template>
    <div>
        <button className="bg-gray-200 rounded-md" @click="deleteImage(key)">Delete Image</button>
    </div>
  
</template>

<style scoped>

</style>
