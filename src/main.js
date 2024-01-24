import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '38581937-9c20710af1d4a9eb0308799a1';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.querySelector('.form');
const galery = document.querySelector('.gallery');
const spinner = document.querySelector('.loader');

spinner.style.display = 'none';



form.addEventListener('submit', onFormSubmit);

function onFormSubmit(ev) {
    ev.preventDefault();
    spinner.style.display = 'block';
    galery.innerHTML = '';
    const selectedPicture = ev.target.image.value;
    fetchImages(selectedPicture).then(images => {
        handleWithResponce(images);
    }).catch(error => console.log(error))
}

function fetchImages(image) {
    const searchParams = new URLSearchParams({
        key: API_KEY,
        image_type: "photo",
        orientation: 'horizontal',
        safesearch: true,
    });

    return fetch(`${BASE_URL}?${searchParams}&q=${image}`).then(response => {
        if (!response.ok) {
            throw new Error(response.status)
        }
        return response.json();
    })
}

function handleWithResponce(images) {
    if (!images.total) {
        iziToast.warning({
            position: 'topRight',
            message: 'Sorry, there are no images matching your search query. Please try again!',
        });
        spinner.style.display = 'none';
        return
    }
    iziToast.success({
        position: 'topRight',
        message: `Congratulations! We found ${images.total} images`,
        timeout: 2000,
    });
    renderGallery(images.hits);
    spinner.style.display = 'none';
    const galleryLightBox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
    galleryLightBox.refresh();
}


function renderGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, comments, downloads, views }) => `<li class='gallery-item'>
    <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
        <div class="gallery-description">
      <span class='gallery-span'>
        <div class="upper-text">Likes</div>
        <div class="lower-text">${likes}</div>
      </span>
      <span class='gallery-span'>
        <div class="upper-text">Views</div>
        <div class="lower-text">${views}</div>
      </span>
      <span class='gallery-span'>
        <div class="upper-text">Comments</div>
        <div class="lower-text">${comments}</div>
      </span>
      <span class='gallery-span'>
        <div class="upper-text">Downloads</div>
        <div class="lower-text">${downloads}</div>
      </span>
      </div>
        </a>
</li>`).join('');
    galery.insertAdjacentHTML('beforeend', markup);
}
