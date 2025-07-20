import Post from '../models/post-model.js'
import { capitalizeEachWord } from '../utils/helper.js'
import { parse } from 'marked'

// Use a simpler in-memory cache solution
const cache = new Map()
const cacheTTL = 120000 // 2 minutes
const staleTTL = 60000 // 1 minute for background revalidation

// Simple cache implementation
const cacheManager = {
  get(key) {
    if (!cache.has(key)) return null
    const item = cache.get(key)
    if (Date.now() > item.expiry) {
      cache.delete(key)
      return null
    }
    return item.value
  },
  set(key, value) {
    const expiry = Date.now() + cacheTTL
    cache.set(key, { value, expiry })
  },
  clear() {
    cache.clear()
  }
}

const layout = 'layouts/home'

// Locale data is constant and can be defined once
const defaultLocale = {
  title: 'Lostpeople',
  description: 'Lostpeople adalah blog inspiratif yang menyajikan cerita, tips, dan informasi seputar kehidupan serta teknologi.',
  keywords: 'lostpeople, blog, inspirasi, teknologi, devchamploo, gper, umam alfarizi, lost, people, dev',
  author: 'devChampl000',
  image: null,
  icon: '/assets/favicon.svg',
  name: 'Lostpeople',
  url: 'https://lostpeople.vercel.app'
}

const homePage = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .select('title slug excerpt thumbnail category createdAt author')
      .populate('author', 'fullname')
      .sort({ createdAt: -1 })
      .limit(7)
      .lean()

    res.render('index', {
      posts,
      layout,
      locale: defaultLocale,
      capitalizeEachWord,
      pageActive: 'home'
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}



// Enhanced URL builder with proper encoding and param handling
const buildUrlParams = (existingParams = {}, updates = {}) => {
  // Clean existing parameters
  const cleanedExisting = Object.entries(existingParams)
    .filter(([_, v]) => v !== null && v !== undefined && v !== '')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  // Merge with updates
  const merged = { ...cleanedExisting, ...updates };

  // Encode and join parameters
  return Object.entries(merged)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
};

// Async function to get categories (cached)
const getCategories = async () => {
  const cacheKey = 'post_categories'
  const cachedCategories = cacheManager.get(cacheKey)

  if (cachedCategories) {
    return cachedCategories
  }

  // Use distinct for efficiency and sort alphabetically
  const categories = await Post.distinct('category', {
    status: 'published',
    category: { $exists: true, $ne: null }
  })

  categories.sort() // Sort categories alphabetically

  cacheManager.set(cacheKey, categories)
  return categories
}

const postsPage = async (req, res) => {
  try {
    const startTime = Date.now()
    const perPage = 10
    const page = parseInt(req.query.page) || 1

    const {
      order = null,
      category = null,
      tag = null,
      search = null
    } = req.query

    const cacheKey = `posts_${page}_${order}_${category}_${tag}_${search}`
    const cachedData = cacheManager.get(cacheKey)

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`)
      return res.render('posts', cachedData)
    }

    const urlParams = { order, category, tag, search }
    const categoryUrl = buildUrlParams({ ...urlParams, category: null })
    const orderUrl = buildUrlParams({ ...urlParams, order: null })
    const pageUrl = buildUrlParams(urlParams)

    let matchQuery = { status: 'published' }
    if (category) matchQuery.category = category
    if (tag) matchQuery.tags = tag
    if (search) {
      const searchNoSpecialChar = search.replace(/[^a-zA-Z0-9 ]/g, '')
      matchQuery.$text = { $search: searchNoSpecialChar }
    }

    const sortOrder = { createdAt: order === 'asc' ? 1 : -1 }

    const [posts, count, postCategories] = await Promise.all([
      Post.find(matchQuery)
        .sort(sortOrder)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .select('title slug excerpt thumbnail category createdAt tags')
        .lean(),
      Post.countDocuments(matchQuery),
      getCategories()
    ])

    const prevPage = page > 1 ? page - 1 : null
    const nextPage = page < Math.ceil(count / perPage) ? page + 1 : null

    const renderData = {
      layout,
      posts,
      postCategories,
      capitalizeEachWord,
      categoryUrl,
      orderUrl,
      pageUrl,
      current: page,
      count,
      prevPage,
      nextPage,
      order,
      category,
      tag,
      search,
      locale: defaultLocale,
      pageActive: 'blog'
    }

    cacheManager.set(cacheKey, renderData)

    const endTime = Date.now()
    console.log(`postsPage rendered in ${endTime - startTime}ms`)

    res.render('posts', renderData)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}


const postDetailPage = async (req, res, next) => {
  try {
    const startTime = Date.now()
    const slug = req.params.slug

    // Check cache first (except for view count which must be accurate)
    const cacheKey = `post_detail_${slug}`
    const cachedPost = cacheManager.get(cacheKey)

    let post
    if (cachedPost) {
      // If cached, just update view count in background but use cached data
      post = cachedPost
      // Update view count in background without waiting
      Post.updateOne(
        { slug, status: 'published' },
        { $inc: { viewsCount: 1 } }
      ).exec().catch(err => console.error('Error updating view count:', err))
    } else {
      // If not cached, get from database
      post = await Post.findOneAndUpdate(
        { slug, status: 'published' },
        { $inc: { viewsCount: 1 } },
        { new: true }
      )
        .populate('userId', 'name image fullname')
        .lean()
        .exec()

      if (!post) {
        return next()
      }

      // Parse markdown content
      post.content = parse(post.content)

      // Cache the post for future requests
      cacheManager.set(cacheKey, post)
    }

    // Build locale for the post
    const locale = {
      ...defaultLocale,
      title: `${post.title} | Lostpeople`,
      description: post.excerpt,
      keywords: `${post.tags.join(', ')}, lostpeople, blog, devchamploo, gper, blog, umam alfarizi, lost, people, dev`,
      author: post.userId?.name || 'Umam Alfarizi',
      image: post.thumbnail,
      url: `https://lostpeople.vercel.app/${post.slug}`
    }

    // Log performance
    const endTime = Date.now()
    console.log(`postDetailPage rendered in ${endTime - startTime}ms`)

    res.render('post-detail', {
      layout,
      post,
      capitalizeEachWord,
      locale,
      pageActive: 'post-detail'
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

export { homePage, postsPage, postDetailPage }
