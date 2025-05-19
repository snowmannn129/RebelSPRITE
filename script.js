// Default and custom sizes
let sizes = [16, 32, 48, 64, 128, 256];
let customSizes = [];

// Size presets
const presets = {
  favicon: [16, 32, 48, 64, 96, 128, 152, 167, 180, 192, 196],
  android: [48, 72, 96, 144, 192, 512],
  ios: [40, 58, 60, 80, 87, 120, 152, 167, 180, 1024],
  social: [16, 32, 64, 144, 512, 1200]
};

// DOM Elements
const dropArea = document.getElementById("drop-area");
const previews = document.getElementById("previews");
const fileInput = document.getElementById("file-input");
const loadBtn = document.getElementById("load-btn");
const saveBtn = document.getElementById("save-btn");
const outputDirBtn = document.getElementById("output-dir-btn");
const nameInput = document.getElementById("filename");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const settingsClose = document.querySelector(".settings-close");
const aboutModal = document.getElementById("about-modal");
const aboutClose = document.querySelector(".about-close");
const aboutBtn = document.getElementById("about-btn");
const addSizeBtn = document.getElementById("add-size-btn");
const customWidthInput = document.getElementById("custom-width");
const customHeightInput = document.getElementById("custom-height");
const customSizesList = document.getElementById("custom-sizes-list");
const outputFormat = document.getElementById("output-format");
const qualityControl = document.getElementById("quality-control");
const qualitySlider = document.getElementById("quality-slider");
const qualityValue = document.getElementById("quality-value");
const maintainAspectRatio = document.getElementById("maintain-aspect-ratio");
const applyBackground = document.getElementById("apply-background");
const backgroundColor = document.getElementById("background-color");
const presetButtons = {
  favicon: document.getElementById("preset-favicon"),
  android: document.getElementById("preset-android"),
  ios: document.getElementById("preset-ios"),
  social: document.getElementById("preset-social")
};

// State variables
let originalImages = [];
let currentImageIndex = 0;
let outputDirectory = null;
const directoryStatus = document.getElementById("directory-status");

// Event listeners for the main UI
loadBtn.onclick = () => fileInput.click();
fileInput.onchange = () => handleFiles(fileInput.files);
dropArea.ondragover = e => { e.preventDefault(); dropArea.style.borderColor = '#aaa'; };
dropArea.ondrop = e => {
  e.preventDefault();
  dropArea.style.borderColor = '#666';
  handleFiles(e.dataTransfer.files);
};

// Settings modal events
settingsBtn.onclick = () => {
  settingsModal.style.display = "block";
};

settingsClose.onclick = () => {
  settingsModal.style.display = "none";
};

// About modal events
aboutBtn.onclick = () => {
  aboutModal.style.display = "block";
};

aboutClose.onclick = () => {
  aboutModal.style.display = "none";
};

// Custom size functionality
addSizeBtn.onclick = () => {
  const width = parseInt(customWidthInput.value);
  const height = parseInt(customHeightInput.value);
  
  if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
    alert("Please enter valid width and height values.");
    return;
  }
  
  // Add to custom sizes array
  const sizeKey = `${width}x${height}`;
  if (!customSizes.some(s => s.key === sizeKey)) {
    customSizes.push({ key: sizeKey, width, height });
    updateCustomSizesList();
    
    // Clear inputs
    customWidthInput.value = "";
    customHeightInput.value = "";
    
    // Re-render previews if we have images loaded
    if (originalImages.length > 0) {
      renderPreviews();
    }
  }
};

function updateCustomSizesList() {
  customSizesList.innerHTML = "";
  
  customSizes.forEach(size => {
    const sizeItem = document.createElement("div");
    sizeItem.className = "custom-size-item";
    sizeItem.textContent = `${size.width}x${size.height}`;
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-size";
    removeBtn.textContent = "×";
    removeBtn.onclick = () => {
      customSizes = customSizes.filter(s => s.key !== size.key);
      updateCustomSizesList();
      
      // Re-render previews if we have images loaded
      if (originalImages.length > 0) {
        renderPreviews();
      }
    };
    
    sizeItem.appendChild(removeBtn);
    customSizesList.appendChild(sizeItem);
  });
}

// Preset buttons
Object.keys(presetButtons).forEach(presetName => {
  presetButtons[presetName].onclick = () => {
    sizes = [...presets[presetName]]; // Apply the preset
    
    // Re-render previews if we have images loaded
    if (originalImages.length > 0) {
      renderPreviews();
    }
    
    // Update UI feedback
    Object.values(presetButtons).forEach(btn => {
      btn.style.backgroundColor = "";
    });
    presetButtons[presetName].style.backgroundColor = "#08d9d6";
  };
});

// Output format events
outputFormat.onchange = () => {
  // Show quality control for lossy formats
  if (outputFormat.value === "jpeg" || outputFormat.value === "webp") {
    qualityControl.style.display = "block";
  } else {
    qualityControl.style.display = "none";
  }
};

qualitySlider.oninput = () => {
  qualityValue.textContent = qualitySlider.value;
};

function handleFiles(files) {
  // Filter only image files
  const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
  
  if (imageFiles.length === 0) return;
  
  // Clear existing images if handling new ones
  originalImages = [];
  currentImageIndex = 0;
  
  // Extract the filename without extension and set it as the default name from the first file
  if (imageFiles[0].name) {
    const filename = imageFiles[0].name.replace(/\.[^/.]+$/, ""); // Remove file extension
    nameInput.value = filename;
  }

  // Process each image file
  let loadedCount = 0;
  
  imageFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        originalImages.push(img);
        loadedCount++;
        
        // When all images are loaded, render the previews
        if (loadedCount === imageFiles.length) {
          renderPreviews();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderPreviews() {
  previews.innerHTML = "";
  if (originalImages.length === 0) return;
  
  const currentImage = originalImages[currentImageIndex];
  
  // Combine standard sizes and custom sizes
  const allSizes = [
    ...sizes.map(size => ({ key: `${size}x${size}`, width: size, height: size })),
    ...customSizes
  ];
  
  allSizes.forEach(size => {
    let width = size.width;
    let height = size.height;
    
    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    // Apply background if option is selected
    if (applyBackground && applyBackground.checked) {
      ctx.fillStyle = backgroundColor.value;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Calculate drawing dimensions based on aspect ratio preference
    let srcWidth = currentImage.width;
    let srcHeight = currentImage.height;
    let destX = 0;
    let destY = 0;
    let destWidth = width;
    let destHeight = height;
    
    if (maintainAspectRatio && maintainAspectRatio.checked) {
      const srcRatio = srcWidth / srcHeight;
      const destRatio = width / height;
      
      if (srcRatio > destRatio) {
        // Source is wider than destination
        destHeight = width / srcRatio;
        destY = (height - destHeight) / 2;
      } else {
        // Source is taller than destination
        destWidth = height * srcRatio;
        destX = (width - destWidth) / 2;
      }
    }
    
    // Draw image to canvas
    ctx.drawImage(currentImage, 0, 0, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
    
    // Create wrapper and add to previews
    const wrapper = document.createElement("div");
    wrapper.className = "preview-item";
    wrapper.appendChild(canvas);
    wrapper.appendChild(document.createTextNode(`${width}x${height}`));
    previews.appendChild(wrapper);
  });
  
  // Add navigation UI if multiple images
  if (originalImages.length > 1) {
    const navContainer = document.createElement("div");
    navContainer.style.width = "100%";
    navContainer.style.textAlign = "center";
    navContainer.style.margin = "20px 0";
    
    const counter = document.createElement("div");
    counter.textContent = `Image ${currentImageIndex + 1} of ${originalImages.length}`;
    counter.style.marginBottom = "10px";
    
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous Image";
    prevBtn.disabled = currentImageIndex === 0;
    prevBtn.onclick = () => {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        renderPreviews();
      }
    };
    
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next Image";
    nextBtn.disabled = currentImageIndex === originalImages.length - 1;
    nextBtn.onclick = () => {
      if (currentImageIndex < originalImages.length - 1) {
        currentImageIndex++;
        renderPreviews();
      }
    };
    
    navContainer.appendChild(counter);
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);
    previews.appendChild(navContainer);
  }
}

// Output directory selection
outputDirBtn.onclick = async () => {
  try {
    // Show directory picker
    outputDirectory = await window.showDirectoryPicker();
    outputDirBtn.textContent = "Output Directory Selected";
    outputDirBtn.classList.add("selected");
    
    // Display the directory name in the status text
    try {
      const dirName = outputDirectory.name;
      directoryStatus.textContent = `Selected directory: ${dirName}`;
    } catch (e) {
      directoryStatus.textContent = "Output directory selected";
    }
  } catch (err) {
    console.error("Error selecting directory:", err);
    // User cancelled or API not supported
    if (err.name !== 'AbortError') {
      directoryStatus.textContent = "Error: Directory selection not supported in this browser";
    }
  }
};

saveBtn.onclick = async () => {
  const name = nameInput.value.trim() || "sprite";
  const format = outputFormat ? outputFormat.value : 'png';
  
  // Prepare options for canvas.toBlob()
  const mimeType = `image/${format}`;
  const quality = format === 'png' ? undefined : (qualitySlider ? qualitySlider.value / 100 : 0.9);
  
  // Get all canvases
  const canvases = Array.from(previews.querySelectorAll("canvas"));
  
  if (canvases.length === 0) {
    alert("No images to save. Please load an image first.");
    return;
  }
  
  if (outputDirectory) {
    // Save to selected directory using File System Access API
    try {
      let successCount = 0;
      
      for (const canvas of canvases) {
        const width = canvas.width;
        const height = canvas.height;
        const fileName = `${name}_${width}x${height}.${format}`;
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, mimeType, quality);
        });
        
        // Create a file in the selected directory
        const fileHandle = await outputDirectory.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        successCount++;
      }
      
      alert(`${successCount} images saved to selected directory!`);
    } catch (err) {
      console.error("Error saving files:", err);
      alert("Error saving files to directory: " + err.message);
    }
  } else {
    // Fallback to default download if no directory selected
    canvases.forEach(canvas => {
      const width = canvas.width;
      const height = canvas.height;
      
      canvas.toBlob(blob => {
        const a = document.createElement("a");
        a.download = `${name}_${width}x${height}.${format}`;
        a.href = URL.createObjectURL(blob);
        a.click();
      }, mimeType, quality);
    });
  }
};

// When window closes modals
window.onclick = (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = "none";
  }
  if (e.target === aboutModal) {
    aboutModal.style.display = "none";
  }
};
