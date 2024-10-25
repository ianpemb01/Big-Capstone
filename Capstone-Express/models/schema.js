import { Schema, model } from 'mongoose'


const postSchema = new Schema({

    url: {
        required: true,
        type: String
    },
    timeCreated: {
        required: true,
        type: String
    },
    prompt: {
        required: true,
        type: String
    }
})

export default model('URLS', postSchema)