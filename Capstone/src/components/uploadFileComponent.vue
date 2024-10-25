<script setup>
import {ref} from 'vue';
import axios from'axios';

const file = ref(null)

let imageOneUrl = ref('');

const prepareImage = (event) => {
    file.value = event.target.files[0];
    imageOneUrl.value = URL.createObjectURL(event.target.files[0])
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
    <div className="flex flex-col justify-center items-center te">
        <div class="upload">
            <div class="labels">
                <h1 className="text-[#21211D]">Please upload image:</h1>
                <input className="text-[#21211D]" type="file" name="image" @change="prepareImage" />
            </div>
        <div>
            <img class="image" :key="imageOneUrl" :src="imageOneUrl">
        </div>
        </div>
        <button className="bg-gray-200 rounded-md" @click="sendImage()">Image</button>

    </div>
    
 
</template>

<style scoped>

.image {
    height: 100px;
    width: auto;
  }

  .upload {
    display: flex;
    flex-direction: row;

  }

  .labels {
    display: flex;
    flex-direction: column;
  }

</style>