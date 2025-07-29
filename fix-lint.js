/**
 * This script runs ESLint to fix formatting issues across the codebase.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories and files to lint
const lintTargets = [
  'app/controllers',
  'app/middlewares',
  'app/models',
  'app/routes',
  'app/utils',
  'app/config',
  'index.js'
];

// Log header
console.log('🔍 Running ESLint to fix code style issues...\n');

// Check if ESLint is installed
try {
  console.log('Checking ESLint installation...');
  execSync('npx eslint --version', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ ESLint is not installed. Please run: npm install eslint --save-dev');
  process.exit(1);
}

// Create a single command with all targets
const command = `npx eslint --ext .js --fix ${lintTargets.join(' ')}`;

console.log(`\nLinting the following targets:\n- ${lintTargets.join('\n- ')}\n`);

try {
  execSync(command, { stdio: 'inherit' });
  console.log('\n✅ Linting process completed successfully!');
} catch (error) {
  console.error(`❌ Error during linting: ${error.message}`);
}
