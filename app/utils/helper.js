import slugify from 'slugify'
import Post from '../models/post-model.js'

const capitalizeEachWord = (str) => {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase()
    })
}

const generateUniqueSlug = async (title) => {
    let baseSlug = slugify(title, { lower: true, strict: true })
    let slug = baseSlug
    let postExists = await Post.findOne({ slug })

    let counter = 1

    while (postExists) {
        slug = `${baseSlug}-${counter}`
        postExists = await Post.findOne({ slug })
        counter++
    }

    return slug
}

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000)

    var interval = seconds / 31536000

    if (interval > 1) {
        return Math.floor(interval) + ' year(s)'
    }
    interval = seconds / 2592000
    if (interval > 1) {
        return Math.floor(interval) + ' month(s)'
    }
    interval = seconds / 86400
    if (interval > 1) {
        return Math.floor(interval) + ' day(s)'
    }
    interval = seconds / 3600
    if (interval > 1) {
        return Math.floor(interval) + ' hour(s)'
    }
    interval = seconds / 60
    if (interval > 1) {
        return Math.floor(interval) + ' minute(s)'
    }
    return Math.floor(seconds) + ' second(s)'
}
// var aDay = 24 * 60 * 60 * 1000
//   console.log(timeSince(new Date(Date.now()-aDay)));
//   console.log(timeSince(new Date(Date.now()-aDay*2)));

export { capitalizeEachWord, generateUniqueSlug, formatDate, timeSince }
