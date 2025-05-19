# RebelSPRITE Installation Guide

This document provides instructions for installing and running RebelSPRITE Image Resizer.

## Quick Start

RebelSPRITE is a web application that runs directly in your browser. No traditional installation is required.

### Method 1: Direct Use

1. Download the latest release from [GitHub Releases](https://github.com/yourusername/rebelsprite/releases)
2. Extract the ZIP file to any location on your computer
3. Open `index.html` in your web browser (Chrome or Edge recommended for full functionality)

### Method 2: Using NPM

If you have Node.js installed:

```bash
# Install globally
npm install -g rebelsprite

# Run the application
npx serve rebelsprite
```

Then open your browser to the URL displayed in the terminal (typically http://localhost:5000).

### Method 3: Install as PWA

For the best experience, you can install RebelSPRITE as a Progressive Web App:

1. Open the application in Chrome or Edge
2. Look for the install icon in the address bar (or three-dot menu)
3. Click "Install RebelSPRITE"
4. The application will install and can be launched from your desktop/start menu

## System Requirements

- Modern web browser (Chrome, Edge, Firefox, or Safari)
- JavaScript enabled
- For full functionality (directory selection), use Chrome or Edge

## Features That Require Special Permissions

- **File System Access API**: Required for the "Choose Output Directory" feature
  - This works only in Chrome and Edge
  - You'll be prompted to grant permission when using this feature
  - Other browsers will fallback to individual file downloads

## Troubleshooting

If you encounter issues:

- Ensure your browser is up to date
- Check that JavaScript is enabled
- For "File not found" errors when using the service worker, try clearing your browser cache
- Contact support at rebelsoftware@outlook.com

## Building From Source

To build the application from source:

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/rebelsprite.git
   cd rebelsprite
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Create distribution packages
   ```bash
   npm run build
   ```

The build process will create distribution packages in the `dist` directory.
