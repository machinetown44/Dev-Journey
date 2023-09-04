// Fetch from GitHub and render content
async function fetchAndRenderContent(gitHubFolderPath, containerId, renderFunction) {
  const container = document.getElementById(containerId);
  
  const response = await fetch(`https://api.github.com/repos/machinetown44/Dev-Journey/contents/${gitHubFolderPath}`);
  const files = await response.json();
  renderFunction(files, container);
}

// Render Markdown CV
async function renderMarkdownCV(files, container) {
  const markdownFile = files.find(file => file.name.endsWith('.md'));
  const response = await fetch(markdownFile.download_url);
  const text = await response.text();

  // Convert Markdown to HTML and add to container
  container.innerHTML = converter.makeHtml(text);
}

// Render media files
async function renderMedia(files, container) {
  const mediaFiles = files.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.gif')).reverse();
  
  mediaFiles.forEach(async file => {
    const mediaName = file.name;
    const descriptionName = mediaName.split('.')[0] + '.md';
    const descriptionFile = files.find(f => f.name === descriptionName);

    if (descriptionFile) {
      const response = await fetch(descriptionFile.download_url);
      const descriptionText = await response.text();
      renderMediaBlock(descriptionText, file, container);
    } else {
      renderMediaBlock(null, file, container);
    }
  });
}

// Intersection Observer for animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('slide-in-right');
    }
  });
});

function renderMediaBlock(descriptionText, file, container) {
  const mediaItem = document.createElement('div');
  mediaItem.className = 'media-item';
  observer.observe(mediaItem); // Observe this element

  const separator = document.createElement('hr');
  const description = document.createElement('p');
  const mediaElement = file.name.endsWith('.mp4') ? document.createElement('video') : document.createElement('img');
  mediaElement.crossOrigin = "anonymous";
  

  if (descriptionText) {
    description.style.flex = "1";
    mediaElement.style.flex = "2";
    const descriptionHtml = converter.makeHtml(descriptionText);
    description.innerHTML = descriptionHtml;
    mediaItem.appendChild(description);
  } else {
    // Center if there is no description
    mediaItem.style.justifyContent = "center";
    mediaElement.style.clipPath = "none";
  }

  mediaElement.src = file.download_url;
  if (file.name.endsWith('.mp4')) {
    mediaElement.controls = true;
  }

  mediaItem.appendChild(mediaElement);
  container.appendChild(mediaItem);
  container.appendChild(separator);
}

const converter = new showdown.Converter();

// Initialization function
window.addEventListener('load', () => {
  // Fetch and render CV
  fetchAndRenderContent('.', 'cv-container', renderMarkdownCV);
  
  // Fetch and render media
  fetchAndRenderContent('media', 'media-container', renderMedia);
});
