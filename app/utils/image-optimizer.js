import path from 'path';

/**
 * Image optimization utility functions
 * Helps with responsive images and lazy loading
 */

// Generate srcset for responsive images
export const generateSrcSet = (imageUrl, sizes = [320, 640, 960, 1280]) => {
  if (!imageUrl) return null;

  const ext = path.extname(imageUrl);
  const basePath = imageUrl.slice(0, -ext.length);

  return sizes
    .map(size => `${basePath}-${size}w${ext} ${size}w`)
    .join(', ');
};

// Get image dimensions for width/height attributes to prevent layout shifts
export const getImageDimensions = (imageUrl, defaultDimensions = { width: 800, height: 600 }) => {
  // In a real implementation, you'd have a database of image dimensions
  // or use image metadata. For now, we return defaults
  return defaultDimensions;
};

// Determine if an image should be lazy loaded based on position
export const shouldLazyLoad = (position) => {
  // First 2-3 images that might be in viewport should not be lazy loaded
  return position >= 3;
};

// Get appropriate size attribute for img tag
export const getSizeAttribute = (imageType) => {
  switch (imageType) {
    case 'thumbnail':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'banner':
      return '100vw';
    case 'avatar':
      return '80px';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
};

// Generate optimized image tag
export const optimizedImageTag = ({
  src,
  alt,
  className = '',
  imageType = 'content',
  position = 0,
  width,
  height,
  loading = null,
}) => {
  // Use default image if src is not provided
  const imageSrc = src || '/assets/img/no-image.png';
  const dimensions = width && height ? { width, height } : getImageDimensions(imageSrc);
  const shouldLazy = loading === null ? shouldLazyLoad(position) : loading === 'lazy';

  return `
    <img
      src="${imageSrc}"
      alt="${alt || 'Image'}"
      class="${className}"
      ${dimensions.width ? `width="${dimensions.width}"` : ''}
      ${dimensions.height ? `height="${dimensions.height}"` : ''}
      ${shouldLazy ? 'loading="lazy"' : 'loading="eager"'}
      ${imageType !== 'avatar' ? `sizes="${getSizeAttribute(imageType)}"` : ''}
      onerror="this.onerror=null; this.src='/assets/img/no-image.png';"
    />
  `.trim().replace(/\s+/g, ' ');
};

export default {
  generateSrcSet,
  getImageDimensions,
  shouldLazyLoad,
  getSizeAttribute,
  optimizedImageTag,
};
