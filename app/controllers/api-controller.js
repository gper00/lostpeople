import Post from '../models/post-model.js';
import { site } from '../utils/constants.js';

// GET /api/sitemap.xml
const getSitemap = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    const lastMod = posts.length ? posts[0].createdAt.toISOString() : new Date().toISOString();

    res.header('Content-Type', 'application/xml');
    res.render('sitemap', {
      layout: false,
      siteUrl: site.url,
      posts,
      lastMod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const { sort } = req.query;
    let posts;

    if (sort === 'oldest') {
      posts = await Post.find({ status: 'published' }).sort({ createdAt: 1 });
    } else {
      posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      message: 'Success get all posts',
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/latest
const getLatestPost = async (req, res) => {
  try {
    const post = await Post.findOne({ status: 'published' }).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Success get latest post',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/:slug
const getOnePost = async (req, res) => {
  try {
    const post = await Post.findOne({slug: req.params.slug});
    res.status(200).json({
      message: 'Success get single post',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/category/:category
const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ category, status: 'published' }).sort({ createdAt: -1 });
    res.status(200).json({
      message: `Success get posts with category: ${category}`,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getSitemap, getAllPosts, getLatestPost, getOnePost, getPostsByCategory };
