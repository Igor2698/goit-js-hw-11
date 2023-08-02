export default function createString(arraysWithImg) {
  return arraysWithImg
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
}
