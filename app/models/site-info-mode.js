import mongoose from 'mongoose'

const siteInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    keywords: [
        {
            type: String,
            trim: true
        }
    ],
    description: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
    }
})
