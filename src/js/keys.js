export const keys = {
  BASE_URL: 'https://pixabay.com/api/',
  API_KEY: '38581937-9c20710af1d4a9eb0308799a1',
};

export const searchParams = new URLSearchParams({
  key: keys.API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});
