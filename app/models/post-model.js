const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: [10, 'Title cannot be less than 10 characters'],
            maxLength: [255, 'Title must not exceed 255 characters'],
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category: {
            type: String,
            trim: true,
            maxLength: 25,
            default: null
        },
        thumbnail: {
            type: String,
            default: null
        },
        tags: [
            {
                type: String,
                maxLength: [25, 'Each tag cannot be more than 25 characters'],
                trim: true,
                default: null
            }
        ],
        excerpt: {
            type: String,
            required: true,
            minLength: [30, 'Excerpt cannot be less than 30 characters'],
            maxLength: [500, 'Excerpt must not exceed 500 characters']
        },
        content: {
            type: String,
            required: true,
            minLength: [100, 'Content must be at least 100 characters long']
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        },
        viewsCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post
