<script setup>
import {ref} from 'vue';
import axios from'axios';

const file = ref(null)
const prepareImage = (event) => {
    file.value = event.target.files[0];
}

const sendImage = async () => {
    if (file.value) {
        const formData = new FormData();
        formData.append('image', file.value);

        try {
            const response = await axios.post('http://localhost:3000/upload', formData);
            console.log(response.data);
        }catch(error) {
            console.error('Error uploading image: ', error)
        }
    }
};

</script>

<template>
    <div>
        <h1>Please upload image:</h1>
        <input type="file" name="image" @change="prepareImage" />
        <button @click="sendImage()">Image</button>
    </div>
 
</template>

<style scoped>

</style>