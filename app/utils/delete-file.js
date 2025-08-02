import cloudinary from '../config/cloudinary-config.js';

/**
 * Extracts the Cloudinary public ID from a URL
 * @param {string} url - The Cloudinary URL
 * @returns {string} The extracted public ID
 */
const extractPublicId = url => {
  if (!url) return null;

  try {
    const parts = url.split('/');
    const fileName = parts.pop(); // Get the file name with extension
    const folderPath = parts.slice(-2).join('/'); // Get the folder path
    const publicId = folderPath + '/' + fileName.split('.')[0]; // Combine folder path and file name without extension
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

/**
 * Deletes a post thumbnail from Cloudinary
 * @param {string} thumbnail - The thumbnail URL or public ID
 * @returns {Promise} Promise resolving to the deletion result
 */
const deletePostThumbnail = thumbnail => {
  return new Promise((resolve, reject) => {
    if (!thumbnail) {
      return resolve({ result: 'nothing to delete' });
    }

    const publicId = extractPublicId(thumbnail);
    if (!publicId) {
      return resolve({ result: 'invalid url' });
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error deleting post thumbnail:', error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

/**
 * Deletes a user image from Cloudinary
 * @param {string} image - The image URL or public ID
 * @returns {Promise} Promise resolving to the deletion result
 */
const deleteUserImage = image => {
  return new Promise((resolve, reject) => {
    if (!image) {
      return resolve({ result: 'nothing to delete' });
    }

    const publicId = extractPublicId(image);
    if (!publicId) {
      return resolve({ result: 'invalid url' });
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Error deleting user image:', error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

export { deletePostThumbnail, deleteUserImage };
