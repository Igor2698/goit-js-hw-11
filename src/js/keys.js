export const keys = {
  BASE_URL: 'https://pixabay.com/api/',
  api_key: '38581937-9c20710af1d4a9eb0308799a1',
};

export const searchParams = new URLSearchParams({
  key: keys.api_key,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});
