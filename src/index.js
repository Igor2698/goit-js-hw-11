// Імпортую бібліотеки
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

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
import createString from './js/createString';
import refs from './js/refs';
import clickOnImage from './js/clickOnImage';

// Створив змінну, у яку в майбутньому запишу значення загальної кількості отриманих картинок
let amountOfImages = 0;
isLoading(false);
// hiddenloadMoreButton(true);

// Створюю новий об'єкт на основі класу ImagesApiService
const imagesApiService = new ImagesApiService();
// Додаю слухачі подій
refs.form.addEventListener('submit', handlerSubmitForm);
// refs.loadMoreButton.addEventListener('click', onLoadMore);

// Функція виконується при натисканні кнопки "Search""
async function handlerSubmitForm(event) {
  event.preventDefault();
  // Перезаписую значення query в новоствореному об'єкті imagesApiService. Тепер воно дорівнює тексту, який введено в інпут
  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  //   Перевіряю, чи є якесь значення у інпуті, тому що бекенд віддає данні навіть якщо йому не надіслане значення
  isLoading(true);
  if (imagesApiService.query === '') {
    Notiflix.Notify.failure('Please enter a value');
    refs.galery.innerHTML = '';
    isLoading(false);
    return;
  }

  // При кожному натисканні на кнопку Search скидаю значення page до 1
  imagesApiService.resetPage();
  // При кожному натисканні на кнопку Search очищую сторінку
  refs.galery.innerHTML = '';

  try {
    const date = await imagesApiService.getImages(imagesApiService.query);
    isLoading(false);
    // Зберігаю у змінну кількість отриманих елементів
    amountOfImages = date.totalHits;
    // Зберігаю максимальне значення page, яке можна завантажити на сторінку
    imagesApiService.totalPages = amountOfImages / imagesApiService.limit;
    renderPage(date);
    // Викликаю функцію, яка перевірятиме, чи коректне значення введено в інпут. Якщо ні, то виводимо відповідне повідомлення
    isEmptyValue(amountOfImages, date);
    // Ініціюю створення бібліотеки галереї
    refs.galery.addEventListener('click', clickOnImage);
    window.addEventListener('scroll', throttledScrollGalery);
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong, please reload page.');
  }
}

// Функція-індикатор процесу завантаження данних-в залежності від стану, ховаємо або демонструємо данні та спінер завантаження
function isLoading(value) {
  if (value) {
    refs.form.classList.add('hidden');
    refs.spiner.classList.remove('hidden');
  } else {
    refs.form.classList.remove('hidden');
    refs.spiner.classList.add('hidden');
  }
}
// Створюю нескінченний скрол
const throttledScrollGalery = throttle(scrollGalery, 500);
// Функція виконується коли скрол наближується до кінця сторінки
async function scrollGalery() {
  const documentRect = document.documentElement.getBoundingClientRect();
  try {
    if (documentRect.bottom < document.documentElement.clientHeight + 1000) {
      // Збільшуємо значення page на 1 при кожному виклику функції
      imagesApiService.incrementPage();
      const date = await imagesApiService.getImages(imagesApiService.query);

      renderPage(date);

      // Робимо перевірку - якщо користувач доскролив до кінця сторінки, виводимо повідомлення
      if (
        imagesApiService.page >= imagesApiService.totalPages &&
        date.totalHits > imagesApiService.limit
      ) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        window.removeEventListener('scroll', throttledScrollGalery);
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong, please reload page.');
  }
}

function renderPage(value) {
  const string = createString(value.hits);
  refs.galery.insertAdjacentHTML('beforeend', string);
}
// Функція, яка демонструє користувачу стан завантаження - якщо значення в імпут введено невірно, буде виведено прохання ввести інше значення, або якщо буде введено менше ніж 40 картинок, про це також попереджаємо
function isEmptyValue(length, arrays) {
  if (length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (arrays.totalHits < imagesApiService.limit) {
    Notiflix.Notify.warning(`We found only ${arrays.totalHits} pictures`);
    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${amountOfImages} images`);
  }
}
