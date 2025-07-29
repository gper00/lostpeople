import mongoose from 'mongoose'
import slugify from 'slugify'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
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

// Add indexes for better query performance - skip slug as it's already indexed (unique: true)
postSchema.index({ status: 1 })  // Frequently filtered by status
postSchema.index({ category: 1 })  // Used for filtering
postSchema.index({ tags: 1 })  // Used for filtering and search
postSchema.index({ createdAt: -1 })  // Used for sorting

// Compound indexes for common query patterns
// Covering index untuk query homepage
postSchema.index({
  status: 1,
  createdAt: -1,
  title: 1,
  slug: 1,
  excerpt: 1,
  thumbnail: 1,
  category: 1,
  author: 1
}, {
  name: 'homepage_cover_index',
  background: true
})
postSchema.index({ status: 1, category: 1 })  // Filtering by status and category
postSchema.index({ status: 1, tags: 1 })  // Filtering by status and tags

// Text index for full-text search
// Using a consistent name matching existing index to prevent duplication errors
postSchema.index(
  { title: 'text', excerpt: 'text', content: 'text', tags: 'text', category: 'text' },
  {
    weights: { title: 10, tags: 5, category: 5, excerpt: 3, content: 1 },
    name: 'title_text_excerpt_text_content_text_tags_text_category_text' // Match existing index name
  }
)

const Post = mongoose.model('Post', postSchema)
export default Post

// Improved function to handle existing indexes more gracefully
export const ensureIndexes = async () => {
  try {
    console.log('Ensuring database indexes are created...')

    // Check if indexes already exist before creating them
    const existingIndexes = await mongoose.connection.db
      .collection('posts')
      .listIndexes()
      .toArray()

    const indexNames = existingIndexes.map(index => index.name)
    console.log('Existing indexes:', indexNames.join(', '))

    // Check if text index already exists to avoid recreation errors
    const textIndexExists = existingIndexes.some(index =>
      index.textIndexVersion !== undefined
    )

    if (!textIndexExists) {
      // If no text index exists, create all indexes
      await Post.createIndexes()
      console.log('All database indexes created successfully')
    } else {
      // If text index exists, we won't try to recreate it
      // Just make sure other indexes exist
      console.log('Text index already exists, verifying other indexes')

      // MongoDB will handle duplicate index creation gracefully
      await Post.createIndexes()
      console.log('Database indexes verified successfully')
    }
  } catch (err) {
    // Handle the error but don't crash the application
    console.log('Index verification issue:', err.message)
    console.log('This error is non-fatal, application will continue...')
  }
}
