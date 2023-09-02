async function fetchAndRenderMedia() {
  const mediaContainer = document.getElementById('media-container');
  
  // Fetch file list from GitHub repository
  const response = await fetch('https://api.github.com/repos/machinetown44/Dev-Journey/main/media');
  const files = await response.json();

  // Filter only relevant media files (assuming mp4 and gif)
  const mediaFiles = files.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.gif'));

  for (const file of mediaFiles) {
    const mediaName = file.name;
    const descriptionName = mediaName.split('.')[0] + '.txt';

    // Fetch description from a text file with the same name as the media
    const descriptionResponse = await fetch(`https://raw.githubusercontent.com/machinetown44/Dev-Journey/main/media/${descriptionName}`);
    const descriptionText = await descriptionResponse.text();

    const separator = document.createElement('hr');
    const description = document.createElement('p');
    const mediaElement = mediaName.endsWith('.mp4') ? document.createElement('video') : document.createElement('img');

    description.innerText = descriptionText;
    mediaElement.src = file.download_url;
    if (mediaName.endsWith('.mp4')) {
      mediaElement.controls = true;
    }

    mediaContainer.appendChild(separator);
    mediaContainer.appendChild(description);
    mediaContainer.appendChild(mediaElement);
  }
}


async function fetchAndRenderMarkdown() {
  const markdownContainer = document.getElementById('markdown-content');
  const response = await fetch('https://username.github.io/repo-name/CV.md');
  const markdownText = await response.text();
  const htmlContent = marked(markdownText);
  
  markdownContainer.innerHTML = htmlContent;
}

// Trigger fill on page load
window.addEventListener('load', () => {
  fetchAndRenderMarkdown();
  fetchAndRenderMedia();
});
