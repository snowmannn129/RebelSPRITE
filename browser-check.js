/**
 * RebelSPRITE Browser Compatibility Check
 * This script checks for critical browser features and displays
 * appropriate warning messages if needed.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Features to check
  const requiredFeatures = [
    {
      name: 'Canvas API',
      test: function() { 
        return !!window.CanvasRenderingContext2D;
      },
      critical: true,
      message: 'Canvas API is required for image processing.'
    },
    {
      name: 'File API',
      test: function() { 
        return window.File && window.FileReader && window.FileList && window.Blob;
      },
      critical: true,
      message: 'File API is required for loading images.'
    },
    {
      name: 'File System Access API',
      test: function() { 
        return 'showDirectoryPicker' in window;
      },
      critical: false,
      message: 'File System Access API is not supported. You can still use the application, but you\'ll need to download files individually instead of saving to a directory.'
    },
    {
      name: 'Service Worker',
      test: function() { 
        return 'serviceWorker' in navigator;
      },
      critical: false,
      message: 'Service Worker is not supported. You can still use the application, but offline functionality won\'t be available.'
    }
  ];

  // Create warning container if it doesn't exist
  let warningContainer = document.getElementById('browser-warnings');
  if (!warningContainer) {
    warningContainer = document.createElement('div');
    warningContainer.id = 'browser-warnings';
    warningContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: #ffe082;
      color: #5d4037;
      z-index: 1000;
      font-size: 14px;
      padding: 10px;
      text-align: center;
      display: none;
    `;
    document.body.appendChild(warningContainer);
  }

  // Check features and display warnings
  let criticalWarnings = [];
  let nonCriticalWarnings = [];

  requiredFeatures.forEach(feature => {
    if (!feature.test()) {
      if (feature.critical) {
        criticalWarnings.push(feature.message);
      } else {
        nonCriticalWarnings.push(feature.message);
      }
    }
  });

  // Display messages if needed
  if (criticalWarnings.length > 0) {
    warningContainer.style.backgroundColor = '#ffcdd2';
    warningContainer.style.color = '#b71c1c';
    warningContainer.innerHTML = `
      <strong>❌ Your browser doesn't support essential features required by RebelSPRITE:</strong>
      <ul style="text-align: left; display: inline-block; margin: 5px 0;">
        ${criticalWarnings.map(msg => `<li>${msg}</li>`).join('')}
      </ul>
      <p>Please try a modern browser like Chrome, Edge, or Firefox.</p>
      <button id="close-warning" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
        Close
      </button>
    `;
    warningContainer.style.display = 'block';
  } else if (nonCriticalWarnings.length > 0) {
    warningContainer.style.backgroundColor = '#fff9c4';
    warningContainer.style.color = '#6d4c41';
    warningContainer.innerHTML = `
      <strong>⚠️ Limited functionality:</strong>
      <ul style="text-align: left; display: inline-block; margin: 5px 0;">
        ${nonCriticalWarnings.map(msg => `<li>${msg}</li>`).join('')}
      </ul>
      <p>For the best experience, we recommend using Chrome or Edge.</p>
      <button id="close-warning" style="background: #ffa000; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
        I Understand
      </button>
    `;
    warningContainer.style.display = 'block';
  }

  // Add event listener to close button
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'close-warning') {
      warningContainer.style.display = 'none';
    }
  });
});
