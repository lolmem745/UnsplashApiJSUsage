const API_KEY = 'gx3T16SVvl_E2XSxN4le27HJLvwqHl9HxsRvAIkEFR0';
const imageElement = document.getElementById('random-image');
const photographerInfo = document.getElementById('photographer-info');
const likeButton = document.getElementById('like-button');
const likeCount = document.getElementById('like-count');
const historySlider = document.getElementById('history-slider');

let currentImageId = '';
let likes = JSON.parse(localStorage.getItem('likes')) || {};
let history = JSON.parse(localStorage.getItem('history')) || [];

async function fetchRandomImage() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching random image:', error);
    }
}

function updateLikeButton() {
    if (likes[currentImageId]) {
        likeButton.textContent = 'Unlike';
        likeCount.textContent = likes[currentImageId];
        likeButton.classList.add('liked'); 
    } else {
        likeButton.textContent = 'Like';
        likeCount.textContent = '0';
        likeButton.classList.remove('liked');
    }
}

function addToHistory(imageData) {
    history.push(imageData);
    if (history.length > 10) {
        history.shift();
    }
    localStorage.setItem('history', JSON.stringify(history));
    updateHistorySlider();
}

function updateHistorySlider() {
    historySlider.innerHTML = '';
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `<img src="${item.urls.thumb}" alt="History ${index + 1}">`;
        historyItem.addEventListener('click', () => loadImageFromHistory(item));
        historySlider.appendChild(historyItem);
    });
}

async function loadImageFromHistory(imageData) {
    displayImage(imageData);
    updateLikeButton();
}

function displayImage(imageData) {
    currentImageId = imageData.id;
    imageElement.src = imageData.urls.regular;
    photographerInfo.textContent = `Фотограф: ${imageData.user.name}`;
    updateLikeButton();
}

async function loadRandomImage() {
    const imageData = await fetchRandomImage();
    if (imageData) {
        displayImage(imageData);
        addToHistory(imageData);
    }
}

likeButton.addEventListener('click', () => {
    if (likes[currentImageId]) {
        likes[currentImageId]--;
        if (likes[currentImageId] === 0) {
            delete likes[currentImageId];
        }
    } else {
        likes[currentImageId] = 1;
    }
    localStorage.setItem('likes', JSON.stringify(likes));
    updateLikeButton();
});

window.addEventListener('load', async () => {
    await loadRandomImage();
    updateHistorySlider();
});