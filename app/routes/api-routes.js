import express from 'express';
import { getAllPosts, getLatestPost, getOnePost, getPostsByCategory } from '../controllers/api-controller.js';

const router = express.Router();

router.get('/posts', getAllPosts);
router.get('/posts/latest', getLatestPost);
router.get('/posts/:slug', getOnePost);
router.get('/posts/category/:category', getPostsByCategory);

export default router;
