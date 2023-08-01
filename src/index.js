// Імпортую бібліотеки
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
// Параметри бібліотеки Notiflix
Notiflix.Notify.init({
  width: '250px',
  position: 'left-top',
  distance: '10px',
  opacity: 1,
  clickToClose: true,
});

// Імпортую файли JS
import ImagesApiService from './js/pixabayApi';
import refs from './js/refs';

// Створив змінну, у яку в майбутньому запишу значення загальної кількості отриманих картинок
let amountOfImages = 0;
isLoading(false);
hiddenloadMoreButton(true);

// Створюю новий об'єкт на основі класу ImagesApiService
const imagesApiService = new ImagesApiService();
// Додаю слухачі подій
refs.Form.addEventListener('submit', handlerSubmitForm);
refs.loadMoreButton.addEventListener('click', onLoadMore);

// Функція виконується при натисканні кнопки "Search""
async function handlerSubmitForm(event) {
  event.preventDefault();
  // Перезаписую значення query в новоствореному об'єкті imagesApiService. Тепер воно дорівнює тексту, який введено в інпут
  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  //   Перевіряю, чи є якесь значення у інпуті, тому що бекенд віддає данні навіть якщо йому не надіслане значення
  if (imagesApiService.query === '') {
    Notiflix.Notify.failure('Please enter a value');
    refs.Div.innerHTML = '';
    hiddenloadMoreButton(true);
    return;
  }
  //   Виклакаємо функцію, яка "скидає" значення page до 1
  imagesApiService.resetPage();
  hiddenloadMoreButton(true);
  isLoading(true);

  try {
    refs.Div.innerHTML = '';
    const date = await imagesApiService.getImages(imagesApiService.query);

    isLoading(false);
    hiddenloadMoreButton(false);
    amountOfImages = date.totalHits;
    imagesApiService.totalPages = amountOfImages / imagesApiService.limit;

    if (date.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      hiddenloadMoreButton(true);
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${amountOfImages} images`);
    renderPage(date.hits);
  } catch (error) {
    console.log(error);
  }
}

// Функція виконується по кліку на кнопку "Load more"
function onLoadMore() {
  imagesApiService.incrementPage();
  imagesApiService.getImages(imagesApiService.query).then(date => {
    renderPage(date.hits);

    if (imagesApiService.page > imagesApiService.totalPages) {
      hiddenloadMoreButton(true);
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

// Функція рендерить сторінку на основі отриманого значення з інпуту
function renderPage(arraysWithImg) {
  const markup = arraysWithImg
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return ` <div class="photo-card"">
        <a href="${largeImageURL}"><img src="${webformatURL}" width="450px" height="350px" alt="${tags}" loading="lazy"/></a>
          <div class="info" >
            <p class="info-item">
              <b>Likes:</b><br><span class="text">${likes}</span>
            </p>
            <p class="info-item">
              <b>Views:</b><br><span class="text">${views}</span>
            </p>
            <p class="info-item">
              <b>Comments: </b><br><span class="text">${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads: </b><br><span class="text">${downloads}</span>
            </p>
          </div>
        </div>
        `;
      }
    )
    .join('');

  refs.Div.insertAdjacentHTML('beforeend', markup);
  refs.Div.addEventListener('click', clickOnImage);
}

function hiddenloadMoreButton(indicate) {
  if (indicate) {
    refs.loadMoreButton.style.display = 'none';
  } else {
    refs.loadMoreButton.style.display = 'flex';
  }
}

let lightbox;
function clickOnImage(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function isLoading(value) {
  if (value) {
    refs.Form.classList.add('hidden');
    refs.spiner.classList.remove('hidden');
  } else {
    refs.Form.classList.remove('hidden');
    refs.spiner.classList.add('hidden');
  }
}

// const infScroll = new InfiniteScroll(refs.Div, {
//   loading: {
//     msgText: 'Loading more...',
//   },
//   path: function () {
//     return `https://pixabay.com/api/?key=38581937-9c20710af1d4a9eb0308799a1&page=3`;
//   },
//   loadMore: function () {
//     imagesApiService
//       .getImages(imagesApiService.query)
//       .then(date => {
//         console.log(date);
//         renderPage(date.hits);
//         imagesApiService.incrementPage();
//         infScroll.loadNextPage();
//       })
//       .catch(error => {
//         console.log(error);
//         // В случае ошибки загрузки данных, также вызовите метод error() у объекта infScroll
//         // чтобы библиотека могла обработать ошибку и продолжить следить за прокруткой
//         infScroll.error();
//       });
//   },
// });
