import mongoose from 'mongoose'

import { ROLES } from '../utils/constants.js'

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 100
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    maxLength: 25,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    maxLength: 100,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    minLength: 4,
    required: true
  },
  bio: {
    type: String,
    default: null,
    maxLength: 400
  },
  role: {
    type: String,
    enum: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    default: 'admin',
    required: true
  },
  image: {
    type: String,
    default: null
  },
  socialMedia: {
    facebook: {
      type: String,
      default: null,
      trim: true,
      maxLength: 150
    },
    instagram: {
      type: String,
      default: null,
      trim: true,
      maxLength: 150
    },
    twitter: {
      type: String,
      default: null,
      trim: true,
      maxLength: 150
    },
    whatsapp: {
      type: String,
      default: null,
      trim: true,
      maxLength: 150
    },
    telegram: {
      type: String,
      default: null,
      trim: true,
      maxLength: 150
    }
  }
})

const User = mongoose.model('User', userSchema)
export default User
