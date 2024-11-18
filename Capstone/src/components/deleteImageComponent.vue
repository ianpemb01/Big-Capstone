<script setup>
import axios from "axios";
import { useRoute } from "vue-router";

const props = defineProps(["key"]);
const route = useRoute();

const deleteImage = async () => {
    try{
        const response = await axios.delete(`http://generative-image-a-i-express-40t73jy4w.vercel.app/image/delete/${route.params.key}`);
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
