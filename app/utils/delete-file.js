import fs from 'fs'

const deletePostThumbnail = (thumbnail) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`public/uploads/posts/${thumbnail}`, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

const deleteUserImage = (image) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`public/uploads/users/${image}`, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

export { deletePostThumbnail, deleteUserImage }
