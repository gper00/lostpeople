// import cloudinary from '../config/cloudinary-config.js'

// const extractPublicId = (url) => {
//     const parts = url.split('/')
//     const fileName = parts.pop() // Get the file name with extension
//     const folderPath = parts.slice(-2).join('/') // Get the folder path
//     const publicId = folderPath + '/' + fileName.split('.')[0] // Combine folder path and file name without extension
//     return publicId
// }

// const deletePostThumbnail = (thumbnail) => {
//     return new Promise((resolve, reject) => {
//         const publicId = extractPublicId(thumbnail)
//         cloudinary.uploader.destroy(publicId, (error, result) => {
//             if (error) {
//                 return reject(error)
//             }
//             resolve(result)
//         })
//     })
// }

// const deleteUserImage = (image) => {
//     return new Promise((resolve, reject) => {
//         const publicId = extractPublicId(image)
//         cloudinary.uploader.destroy(publicId, (error, result) => {
//             if (error) {
//                 return reject(error)
//             }
//             resolve(result)
//         })
//     })
// }

// export default { deletePostThumbnail, deleteUserImage }


const cloudinary = require('../config/cloudinary-config.js')

const extractPublicId = (url) => {
    const parts = url.split('/')
    const fileName = parts.pop() // Mendapatkan nama file beserta ekstensi
    const folderPath = parts.slice(-2).join('/') // Mendapatkan path folder
    const publicId = folderPath + '/' + fileName.split('.')[0] // Menggabungkan path folder dengan nama file tanpa ekstensi
    return publicId
}

const deletePostThumbnail = (thumbnail) => {
    return new Promise((resolve, reject) => {
        const publicId = extractPublicId(thumbnail)
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result)
        })
    })
}

const deleteUserImage = (image) => {
    return new Promise((resolve, reject) => {
        const publicId = extractPublicId(image)
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result)
        })
    })
}

module.exports = { deletePostThumbnail, deleteUserImage }
