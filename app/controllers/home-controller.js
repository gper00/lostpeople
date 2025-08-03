const Post = require('../models/post-model.js')
const { capitalizeEachWord } = require('../utils/helper.js')
const marked = require('../utils/markdown-parser.js')
const cache = require('../utils/cache.js');

const layout = 'layouts/home'

const homePage = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            { $sort: { createdAt: -1 } },
            { $match: { status: 'published' } }
        ])
            .limit(7)
            .exec()

        const locale = {
            title: 'Lostpeople',
            description: 'Lostpeople adalah blog inspiratif yang menyajikan cerita, tips, dan informasi seputar kehidupan serta teknologi.',
            keywords: "lostpeople, blog, inspirasi, teknologi, devchamploo, gper, umam alfarizi, lost, people, dev",
            author: 'devChampl000',
            image: null,
            icon: '/assets/favicon.svg',
            name: 'Lostpeople',
            url: 'https://lostpeople.vercel.app'
        }

        res.render('index', {
            posts,
            layout,
            locale,
            capitalizeEachWord,
            pageActive: 'home'
        })
    } catch (err) {
        console.error(err)
    }
}

const aboutPage = async (req, res) => {
    const locale = {
        title: 'Lostpeople',
        description: 'Lostpeople adalah blog inspiratif yang menyajikan cerita, tips, dan informasi seputar kehidupan serta teknologi.',
        keywords: "lostpeople, blog, inspirasi, teknologi, devchamploo, gper, umam alfarizi, lost, people, dev",
        author: 'devChampl000',
        image: null,
        icon: '/assets/favicon.svg',
        name: 'Lostpeople',
        url: 'https://lostpeople.vercel.app'
    }

    try {
        res.render('about', {
            layout,
            locale,
            pageActive: 'about'
        })
    } catch (err) {
        console.error(err)
    }
}

const postsPage = async (req, res) => {
    try {
        const cacheKey = `posts-page-${JSON.stringify(req.query)}`;
        let cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log(`Serving posts page from cache for query: ${JSON.stringify(req.query)}`);
            return res.render('posts', { ...cachedData, pageActive: 'blog' });
        }

        console.log(`Fetching posts page from DB for query: ${JSON.stringify(req.query)}`);
        let perPage = 10
        let page = req.query.page || 1

        const {
            order = null,
            category = null,
            tag = null,
            search = null
        } = req.query

        const categoryUrl = `${tag ? 'tag=' + tag + '&' : ''}${order ? 'order=' + order + '&' : ''}${search ? 'search=' + search + '&' : ''}`
        const orderUrl = `${tag ? 'tag=' + tag + '&' : ''}${category ? 'category=' + category + '&' : ''}${search ? 'search=' + search + '&' : ''}`
        const pageUrl = `${tag ? 'tag=' + tag + '&' : ''}${order ? 'order=' + order + '&' : ''}${category ? 'category=' + category + '&' : ''}${search ? 'search=' + search + '&' : ''}`

        let match = { status: 'published' }
        if (category) match.category = category;
        if (tag) match.tags = tag;

        let query = {};
        if (search) {
            const searchNoSpecialChar = search.replace(/[^a-zA-Z0-9 ]/g, '');
            query.$or = [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { category: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { tags: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { excerpt: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ];
        }

        const finalQuery = { ...query, ...match };

        const count = await Post.countDocuments(finalQuery);
        const posts = await Post.find(finalQuery)
            .sort({ createdAt: order === 'asc' ? 1 : -1 })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .lean();

        const postCategories = await Post.find({ status: 'published', category: { $ne: null } })
            .distinct('category')
            .lean();

        const locale = {
            title: 'Lostpeople',
            description: 'Lostpeople adalah blog inspiratif yang menyajikan cerita, tips, dan informasi seputar kehidupan serta teknologi.',
            keywords: "lostpeople, blog, inspirasi, teknologi, devchamploo, gper, umam alfarizi, lost, people, dev",
            author: 'devChampl000',
            image: null,
            icon: '/assets/favicon.svg',
            name: 'Lostpeople',
            url: 'https://lostpeople.vercel.app'
        }

        const pageData = {
            layout,
            posts,
            postCategories,
            capitalizeEachWord,
            categoryUrl,
            orderUrl,
            pageUrl,
            current: page,
            count,
            prevPage: (page > 1) ? parseInt(page) - 1 : null,
            nextPage: (page * perPage) < count ? parseInt(page) + 1 : null,
            order, category, tag, search, locale
        };

        cache.set(cacheKey, pageData);

        res.render('posts', { ...pageData, pageActive: 'blog' });

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal Server Error");
    }
}

const postDetailPage = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const cacheKey = `post-${slug}`;
        let post = cache.get(cacheKey);

        if (post) {
            console.log(`Serving post ${slug} from cache...`);
        } else {
            console.log(`Fetching post ${slug} from DB and caching...`);
            const postFromDb = await Post.findOneAndUpdate(
                { slug: slug, status: 'published' },
                { $inc: { viewsCount: 1 } },
                { new: true }
            ).populate('userId');

            if (postFromDb) {
                post = postFromDb.toObject();
                cache.set(cacheKey, post);
            }
        }

        if (!post) {
            return next();
        }

        post.content = marked.parse(post.content);

        const locale = {
            title: `${post.title} | Lostpeople`,
            description: post.excerpt,
            keywords: `${post.tags.join(', ')}, lostpeople, blog, devchamploo, gper, blog, umam alfarizi, lost, people, dev`,
            author: post.userId.name || 'Umam Alfarizi',
            image: `${post.thumbnail}`,
            icon: '/assets/favicon.svg',
            name: 'Lostpeople',
            url: `https://lostpeople.vercel.app/${post.slug}`
        }

        res.render('post-detail', {
            layout,
            post,
            capitalizeEachWord,
            locale,
            pageActive: 'blog'
        })
    } catch (err) {
        console.error(err)
        next(err)
    }
}

module.exports = { homePage, aboutPage, postsPage, postDetailPage }
