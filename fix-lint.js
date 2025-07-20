/**
 * This script runs ESLint to fix formatting issues across the codebase
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define directories to lint
const directories = [
  'app/controllers',
  'app/middlewares',
  'app/models',
  'app/routes',
  'app/utils',
  'app/config'
]

// Define specific files to lint
const specificFiles = [
  'index.js'
]

// Log header
console.log('🔍 Running ESLint to fix code style issues...\n')

// Check if ESLint is installed
try {
  console.log('Checking ESLint installation...')
  execSync('npx eslint --version', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ ESLint is not installed. Please run: npm install eslint --save-dev')
  process.exit(1)
}

// Fix code style in specified directories
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir)

  if (existsSync(dirPath)) {
    console.log(`\nLinting directory: ${dir}`)
    try {
      execSync(`npx eslint ${dirPath} --ext .js --fix`, { stdio: 'inherit' })
      console.log(`✅ Successfully linted ${dir}`)
    } catch (error) {
      console.error(`❌ Error linting ${dir}: ${error.message}`)
    }
  } else {
    console.log(`⚠️ Directory not found: ${dir}`)
  }
})

// Fix code style in specific files
specificFiles.forEach(file => {
  const filePath = path.join(__dirname, file)

  if (existsSync(filePath)) {
    console.log(`\nLinting file: ${file}`)
    try {
      execSync(`npx eslint ${filePath} --fix`, { stdio: 'inherit' })
      console.log(`✅ Successfully linted ${file}`)
    } catch (error) {
      console.error(`❌ Error linting ${file}: ${error.message}`)
    }
  } else {
    console.log(`⚠️ File not found: ${file}`)
  }
})

console.log('\n🎉 Linting process completed!')
