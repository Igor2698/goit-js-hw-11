// Імпортував бібліотеку axios
import axios from 'axios';

// Імпортував ключі для функцій getBreeds і getCat
import { keys, searchParams } from './keys';
// https://pixabay.com/api/?key=38581937-9c20710af1d4a9eb0308799a1&q=yellow+flowers&image_type=photo

// Отримаємо проміс з елементами порід

export default class ImagesApiService {
  constructor() {
    this.SearchQuery = '';
    this.page = 1;
    this.totalPages = 0;
    this.limit = 40;
  }

  async getImages(value) {
    const url = `${keys.BASE_URL}?${searchParams}&q=${value}&page=${this.page}`;
    try {
      console.log(url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.SearchQuery;
  }

  set query(newQuery) {
    this.SearchQuery = newQuery;
  }
}
