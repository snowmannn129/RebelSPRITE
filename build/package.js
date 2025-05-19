/**
 * RebelSPRITE Packaging Script
 * This script creates distribution packages of the application
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Configuration
const config = {
  name: 'rebelsprite',
  version: require('../package.json').version,
  outputDir: path.resolve(__dirname, '../dist'),
  sourceDir: path.resolve(__dirname, '..'),
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`Created output directory: ${config.outputDir}`);
}

// Create full source package
function createSourcePackage() {
  const output = fs.createWriteStream(path.join(config.outputDir, `${config.name}-${config.version}-src.zip`));
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.pipe(output);
  
  // Add all source files, excluding node_modules, .git, etc.
  archive.glob('**/*', {
    cwd: config.sourceDir,
    ignore: [
      'node_modules/**',
      'dist/**',
      '.git/**',
      '*.zip',
      '.DS_Store',
      'build/**'
    ]
  });
  
  output.on('close', () => {
    console.log(`Source package created: ${archive.pointer()} total bytes`);
  });
  
  archive.finalize();
  return new Promise((resolve) => output.on('close', resolve));
}

// Create web distribution (minified version)
function createWebPackage() {
  const output = fs.createWriteStream(path.join(config.outputDir, `${config.name}-${config.version}-web.zip`));
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.pipe(output);
  
  // Add only the necessary files for web deployment
  // In a more complex project, you might run minification here first
  const webFiles = [
    'index.html',
    'script.js',
    'style.css',
    'assets/**',
    'LICENSE',
    'README.md'
  ];
  
  webFiles.forEach(filePattern => {
    archive.glob(filePattern, { cwd: config.sourceDir });
  });
  
  output.on('close', () => {
    console.log(`Web package created: ${archive.pointer()} total bytes`);
  });
  
  archive.finalize();
  return new Promise((resolve) => output.on('close', resolve));
}

// Main execution
async function main() {
  console.log(`Packaging RebelSPRITE v${config.version}...`);
  
  try {
    await createSourcePackage();
    await createWebPackage();
    console.log('Packaging complete!');
  } catch (error) {
    console.error('Error during packaging:', error);
    process.exit(1);
  }
}

main();
