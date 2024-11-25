
// This bit goes in content.js  
console.log('Chat Image and Video Preview starting...');  

// Keep the indicator but make it smaller and more subtle  
const indicator = document.createElement('div');  
indicator.style.position = 'fixed';  
indicator.style.top = '10px';  
indicator.style.right = '10px';  
indicator.style.backgroundColor = '#00800080'; // Semi-transparent green  
indicator.style.color = 'white';  
indicator.style.padding = '3px';  
indicator.style.zIndex = '9999999';  
indicator.style.fontSize = '8px';  
indicator.style.borderRadius = '3px';  
indicator.textContent = 'Image and Video Preview Active';  
document.body.appendChild(indicator);  

function isImageUrl(url) {  
   // Current check for direct image files  
   if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return true;  
  
   // Check for known image hosting services  
   if (url.includes('imgur.com') && !url.includes('/a/')) return true;  
   if (url.includes('cdn.discordapp.com')) return true;  
   if (url.match(/pbs\.twimg\.com.*format=(jpg|png|gif)/i)) return true;  
  
   return false;  
}  

function isVideoUrl(url) {  
   // Check for direct video files  
   if (url.match(/\.(mp4|webm|ogg)$/i)) return true;  
  
   // Check for known video hosting services  
   if (url.includes('youtube.com') || url.includes('youtu.be')) return true;  
   if (url.includes('vimeo.com')) return true;  
  
   return false;  
}  

function createImagePreview(url) {  
   const img = document.createElement('img');  
   img.src = url;  
   img.style.maxWidth = '300px';  
   img.style.maxHeight = '400px';  
   img.style.display = 'block';  
   img.style.marginTop = '4px';  
   img.style.borderRadius = '4px';  
   return img;  
}  

function createVideoPreview(url) {  
   const video = document.createElement('video');  
   video.src = url;  
   video.style.maxWidth = '300px';  
   video.style.maxHeight = '400px';  
   video.style.display = 'block';  
   video.style.marginTop = '4px';  
   video.style.borderRadius = '4px';  
   video.controls = true;

    // Attempt to enable autoplay
    video.autoplay = true;
    // video.muted = true; // Many browsers require muted videos for autoplay

   return video;  
}  

function watchForLinks() {  
   const chatContainer = document.getElementById('chat-history-list');  
  
   if (!chatContainer) {  
      console.log('Chat container not found yet, retrying in 1 second...');  
      setTimeout(watchForLinks, 1000);  
      return;  
   }  
  
   console.log('Found chat container, starting to watch for links...');  
  
   const observer = new MutationObserver((mutations) => {  
      mutations.forEach((mutation) => {  
          mutation.addedNodes.forEach((node) => {  
             if (node.nodeType === Node.ELEMENT_NODE) {  
                const links = [  
                ...node.querySelectorAll('a'),  
                // ...node.querySelectorAll('.underline'),  
                ...node.querySelectorAll('[href]')  
                ];  
  
              links.forEach(link => {  
                const url = link.href || link.getAttribute('data-url'); // Ensure data-url is set if href doesn't exist
                if (url) {
                  if (isImageUrl(url)) {
                    link.replaceWith(createImagePreview(url));
                  } else if (isVideoUrl(url)) {
                    link.replaceWith(createVideoPreview(url));
                  }
                }
              });
           }
         });
      });
   });  

   observer.observe(chatContainer, { childList: true, subtree: true });
}  

watchForLinks();
setTimeout(watchForLinks, 2000);