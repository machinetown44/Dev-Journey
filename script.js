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
function renderMedia(files, container) {
  const mediaFiles = files.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.gif'));
  
  mediaFiles.forEach(file => {
    const mediaName = file.name;
    const descriptionName = mediaName.split('.')[0] + '.txt';
    const descriptionFile = files.find(f => f.name === descriptionName);

    if (descriptionFile) {
      fetch(descriptionFile.download_url)
        .then(response => response.text())
        .then(descriptionText => renderMediaBlock(descriptionText, file, container));
    } else {
      renderMediaBlock(null, file, container);
    }
  });
}

function renderMediaBlock(descriptionText, file, container) {
  const separator = document.createElement('hr');
  const description = document.createElement('p');
  const mediaElement = file.name.endsWith('.mp4') ? document.createElement('video') : document.createElement('img');

  container.appendChild(separator);
  if (descriptionText) {
    description.innerText = descriptionText;
    container.appendChild(description);
  }

  mediaElement.src = file.download_url;
  if (file.name.endsWith('.mp4')) {
    mediaElement.controls = true;
  }

  container.appendChild(mediaElement);
}

const converter = new showdown.Converter();

// Initialization function
window.addEventListener('load', () => {
  // Fetch and render CV
  fetchAndRenderContent('.', 'cv-container', renderMarkdownCV);
  
  // Fetch and render media
  fetchAndRenderContent('media', 'media-container', renderMedia);
});
