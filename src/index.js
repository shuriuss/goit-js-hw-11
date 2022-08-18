import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let request = '';
let page;

const form = document.querySelector('#search-form');
form.addEventListener('submit', handler);
const gallery = form.nextElementSibling;
const loadMore = document.querySelector('.load-more');
const load = loadMore.parentNode;
loadMore.addEventListener('click', handlerMore);

function handler(e) {
  e.preventDefault();

  page = 1;
  gallery.innerHTML = '';
  request = e.target.elements.searchQuery.value;

  search(request, page)
    .then(response => {
      const data = response.data.hits;
      if (data.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      data.forEach(element => {
        render(element);
        loadMore.classList.remove('is-hidden');
        load.classList.remove('is-hidden');
      });
    })
    .catch(error => {
      console.log(error);
    });

  // e.target.elements.searchQuery.value = '';
}

function handlerMore() {
  page += 1;
  search(request, page).then(response => {
    if (response.data.totalHits  < page * 40) {
     
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.classList.add('is-hidden');
      load.classList.add('is-hidden');

      retern;
    }

    const data = response.data.hits;
    data.forEach(element => {
      render(element);
    });
  });
}

async function search(request, page) {
  const API_KEY = '29337192-6d69f3453e5b53e32a13fad69';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  const response = await axios.get(URL);
  return response;
}

function render({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  // gallery.innerHTML =''
  const markup = `<a href="${largeImageURL}">
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes </b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
  </div></a>`;

  gallery.insertAdjacentHTML('beforeend', markup);
}

// const galler = new SimpleLightbox('.gallery a', {
//   captions: true,
//   captionsData: 'alt',
//   captionPosition: 'bottom',
//   captionDelay: 250,
//   close: true,
// });
