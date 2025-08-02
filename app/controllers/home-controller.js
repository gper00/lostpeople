import Post from '../models/post-model.js';
import { capitalizeEachWord, formatDate } from '../utils/helper.js';
import { site, author, defaults } from '../utils/constants.js';
import { marked } from 'marked';
import slugify from 'slugify';
import hljs from 'highlight.js';

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

// Use a simpler in-memory cache solution
const cache = new Map();
const cacheTTL = 120000; // 2 minutes

// Simple cache implementation
const cacheManager = {
  get(key) {
    if (!cache.has(key)) return null;
    const item = cache.get(key);
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    return item.value;
  },
  set(key, value) {
    const expiry = Date.now() + cacheTTL;
    cache.set(key, { value, expiry });
  },
  clear() {
    cache.clear();
  }
};


// Enhanced URL builder with proper encoding and param handling
const buildUrlParams = (existingParams = {}, updates = {}) => {
  // Clean existing parameters
  const cleanedExisting = Object.entries(existingParams)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  // Merge with updates
  const merged = { ...cleanedExisting, ...updates };

  // Encode and join parameters
  return Object.entries(merged)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
};



const homePage = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const { category, search, order: orderParam } = req.query;
    const order = orderParam === 'asc' ? 'asc' : 'desc';

    let matchQuery = { status: 'published' };
    if (category) matchQuery.category = category;
    if (search) {
      const searchNoSpecialChar = search.replace(/[^a-zA-Z0-9 ]/g, '');
      matchQuery.$text = { $search: searchNoSpecialChar };
    }

    const [postsData, count, categoryList, popularPosts] = await Promise.all([
      Post.find(matchQuery)
        .sort({ createdAt: order === 'asc' ? 1 : -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate('userId', 'fullname image') // Corrected path from 'author' to 'userId'
        .lean(),
      Post.countDocuments(matchQuery),
      Post.distinct('category', { status: 'published', category: { $ne: null } }),
      Post.find({ status: 'published' })
        .sort({ viewsCount: -1 })
        .limit(5)
        .select('title slug coverImage createdAt')
        .lean(),
    ]);

    const posts = postsData.map(post => {
      const mappedPost = {
        ...post,
        author: post.userId, // alias
      };

      if (post.category) {
        mappedPost.category = {
          name: post.category,
          slug: slugify(post.category, { lower: true, strict: true }),
        };
      } else {
        mappedPost.category = null;
      }

      return mappedPost;
    });

    const categories = categoryList.sort().map(cat => ({ name: cat, slug: slugify(cat, { lower: true, strict: true }) }));

    const totalPages = Math.ceil(count / perPage);

    // Pick site author info from first post
    const siteAuthor = postsData.length ? postsData[0].userId : null;

    const pageTitle = () => {
      if (category) {
        const cat = categories.find(c => c.slug === category);
        return cat ? cat.name : 'Category Not Found';
      }
      if (search) return `Search results for "${search}"`;
      return 'All Posts';
    };

    res.render('home', {
      title: pageTitle(),
      posts: posts, // Use the transformed posts
      categories,
      popularPosts,
      siteAuthor,
      buildUrlParams,
      totalPages,
      currentPage: page,
      query: req.query,
      layout: 'layouts/main',
      site,
      author,
      capitalizeEachWord,
      defaults
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


const postDetailPage = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const post = await Post.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .populate('userId', 'fullname image bio') // Changed from 'userId' to 'user' to match template expectations
      .lean();

    if (!post) {
      return next(); // Not found
    }

    // Alias userId to author for template consistency
    post.author = post.userId;

    // Manually construct category and tags objects for the template
    if (post.category) {
      post.category = { name: post.category, slug: slugify(post.category, { lower: true, strict: true }) };
    } else {
      post.category = null;
    }
    post.tags = post.tags.map(tag => ({ name: tag, slug: slugify(tag, { lower: true, strict: true }) }));

    // Calculate reading time (words per minute)
    const wordsPerMinute = 200;
    const noOfWords = post.content.split(/\s/g).length;
    post.readingTime = Math.ceil(noOfWords / wordsPerMinute);

    // Parse markdown content to HTML
    post.content = marked(post.content);

    // Fetch related posts (from the same category, excluding the current post)
    let relatedPosts = [];
    if (post.category && post.category.name) {
      relatedPosts = await Post.find({
        status: 'published',
        category: post.category.name, // Use the category name (string) for querying
        _id: { $ne: post._id },
      })
        .limit(2)
        .select('title slug coverImage createdAt')
        .lean();
    }

    res.render('post-detail', {
      title: post.title,
      post,
      relatedPosts,
      layout: 'layouts/main',
      capitalizeEachWord,
      formatDate,
      site,
      author,
      defaults
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

export { homePage, postDetailPage };
