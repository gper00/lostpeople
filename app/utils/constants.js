/**
 * Application-wide constants and configuration values
 */

// User roles and permissions
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  USER: 'user'
}

// Error messages
export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Hanya file JPG dan PNG yang diperbolehkan',
  FILE_SIZE_LIMIT: 'Ukuran file maksimal 1MB',
  NO_FILE_UPLOADED: 'Silakan pilih file untuk diunggah',
  CLOUD_UPLOAD_FAIL: 'Gagal mengunggah file ke cloud storage',
  DEFAULT_ERROR: 'Terjadi kesalahan pada sistem'
}

// Flash messages
export const FLASH_MESSAGES = {
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully',
  USER_CREATED: 'User created successfully!',
  PROFILE_UPDATED: 'Update profile successfully!'
}

// File upload configuration
export const UPLOAD_CONFIG = {
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png'],
  MAX_FILE_SIZE: 1024 * 1024, // 1MB
  MAX_FILES: 1
}
