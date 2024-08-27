import Post from '../models/post-model.js'
import { capitalizeEachWord, generateUniqueSlug, formatDate, timeSince } from '../utils/helper.js'
import { deletePostThumbnail } from '../utils/delete-file.js'

const layout = 'layouts/dashboard'
const pageActive = 'post'

const postsPage = async (req, res) => {
    const successMessage = req.flash('success')
    const errorMessage = req.flash('failed')

    let posts;
    try {
        if(req.user.role === 'admin'){
            posts = await Post.find({userId: req.user._id})
                .sort({ createdAt: -1 })
                .exec()
        } else {
            posts = await Post.find()
                .populate('userId')
                .sort({ createdAt: -1 })
                .exec()
        }

        res.render('dashboard/posts/index', {
            layout,
            posts,
            successMessage,
            errorMessage,
            pageActive,
            capitalizeEachWord,
            formatDate,
        })
    } catch (err) {
        console.error(err)
    }
}


const createPostPage = async (req, res) => {
    try {
        const errors = req.flash('errors')[0] ?? {}
        const postData = req.flash('postData')[0] ?? {}
        const posts = await Post.find()
        const postCategories = posts
            .filter((x, i, self) => x.category && x.category !== undefined)
            .map((x) => x.category)
            .filter((x, i, self) => self.indexOf(x) === i)

        res.render('dashboard/posts/create', {
            layout,
            errors,
            postData,
            pageActive,
            postCategories,
            capitalizeEachWord
        })
    } catch (err) {
        console.error(err)
        req.flash('failed', err.message || 'Something went wrong')
        res.redirect('/dashboard/posts')
    }
}


const storePost = async (req, res) => {
    try {
        let { title, category, newCategory, tags, excerpt, status, content } = req.body

        if (category) category = category.toLowerCase()
        else if (newCategory) category = newCategory.toLowerCase()
        else category = null

        const post = new Post({
            title,
            slug: await generateUniqueSlug(title),
            userId: req.user._id,
            category,
            thumbnail: req.file ? req.file.path : null,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
            excerpt,
            content,
            status
        })

        await post.save()

        req.flash('success', 'Post created successfully!')
        res.redirect('/dashboard/posts')
    } catch (err) {
        console.error(err)
        req.flash('failed', err.message || 'Something went wrong')
        res.redirect('/dashboard/posts')
    }
}


const postDetailPage = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId').exec()
        res.render('dashboard/posts/detail', {
            layout,
            post,
            pageActive,
            formatDate,
            timeSince,
            capitalizeEachWord
        })
    } catch (err) {
        console.error(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'Post not found' : 'Something went wrong'
        )
        res.redirect('/dashboard/posts')
    }
}


const editPostPage = async (req, res) => {
    const errors = req.flash('errors')[0] ?? {}
    const postData = req.flash('postData')[0] ?? {}

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            req.flash('failed', 'Post not found')
            return res.redirect('/dashboard/posts')
        }

        const posts = await Post.find()
        const postCategories = posts
            .filter((x, i, self) => x.category && x.category !== undefined)
            .map((x) => x.category)
            .filter((x, i, self) => self.indexOf(x) === i)

        res.render('dashboard/posts/edit', {
            layout,
            errors,
            post,
            postData,
            postCategories,
            pageActive,
            capitalizeEachWord
        })
    } catch (err) {
        console.log(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'Post not found' : 'Something went wrong'
        )
        res.redirect('/dashboard/posts')
    }
}


const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            req.flash('failed', 'Post not found')
            return res.redirect('/dashboard/posts')
        }

        let { title, category, newCategory, tags, excerpt, status, content } =
            req.body

        if (category) category = category
        else if (newCategory) category = newCategory.toLowerCase()
        else category = null

        const updatedFields = {
            title,
            category,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
            excerpt,
            content,
            status
        }

        if (title !== post.title) {
            updatedFields.slug = await generateUniqueSlug(title)
        }

        if (req.file) {
            updatedFields.thumbnail = req.file.path
            if (post.thumbnail) {
                deletePostThumbnail(post.thumbnail)
                    .catch((err) => console.eror(err.message))
            }
        }

        await Post.findByIdAndUpdate(req.params.id, { $set: updatedFields })

        req.flash('success', 'Post updated successfully!')
        res.redirect('/dashboard/posts')
    } catch (err) {
        console.log(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'Post not found' : 'Something went wrong'
        )
        res.redirect('/dashboard/posts')
    }
}


const removePostThumbnail = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            req.flash('failed', 'Post not found')
            return res.redirect('/dashboard/posts')
        }

        const updatedFields = {
            thumbnail: null
        }

        deletePostThumbnail(post.thumbnail)
            .catch((err) => console.eror(err.message))

        await Post.findByIdAndUpdate(req.params.id, { $set: updatedFields })

        res.redirect(`/dashboard/posts/${req.params.id}/edit`)
    } catch (err) {
        console.error(err)
    }
}


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            req.flash('failed', 'Post not found')
            res.redirect('/dashboard/posts')
        }

        if (post.thumbnail) {
            deletePostThumbnail(post.thumbnail)
                .catch((err) => console.eror(err.message))
        }

        await Post.findByIdAndDelete(req.params.id)
        req.flash('success', 'Post deleted successfully')
        res.redirect('/dashboard/posts')
    } catch (err) {
        console.error(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'Post not found' : 'Something went wrong'
        )
        res.redirect('/dashboard/posts')
    }
}


export {
    postsPage,
    createPostPage,
    storePost,
    postDetailPage,
    deletePost,
    editPostPage,
    updatePost,
    removePostThumbnail
}
