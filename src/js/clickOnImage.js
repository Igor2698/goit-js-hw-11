export default function clickOnImage(event) {
  event.preventDefault();

  const lightbox = new SimpleLightbox('.gallery a', {
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
  });
}
