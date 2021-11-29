import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixApiService from './pixabaySearch';
//import articlesTpl from './templates/articlesTpl.hbs'
import LoadMoreBtn from './loadMoreBtn.js'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const refs =
{
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
};


const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const pixApiService = new PixApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', loadBtn);


async function onSearch(e) {
  e.preventDefault();
  pixApiService.query = e.currentTarget.elements.query.value.trim();

  if (pixApiService.query === '') {
    return Notify.failure('Введи что-нибудь!');
  }

  const hits = await pixApiService.fetchArticles();
  const totalHits = hits.data.totalHits;

  if (totalHits < 1) {
        Notify.failure("Нет картинок по такому запросу!");
        return;
    } else {
        Notify.success(`Мы нашли ${totalHits} изображений!:).`);
        clearGallery();
    loadMoreBtn.hide();
  }
  pixApiService.resetPage();
  pixApiService.fetchArticles().then(appendArticlesMarkup);
  loadMoreBtn.show();
  loadMoreBtn.enable()

  clearGallery();
};

async function loadBtn() {
    
  if (pixApiService.page !== 2) {
    pixApiService.resetPage();
  }

  pixApiService.fetchArticles().then(appendArticlesMarkup);
    
  const hit = await pixApiService.fetchArticles();
  const hitsLength = hit.data.hits.length;

  if (hitsLength < 40) {
    Notify.info("Вы дошли до конца!");
    return loadMoreBtn.hide();
  }
}


function appendArticlesMarkup(e) {
  const markup = e.data.hits.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
    return `<a class="gallery-item" src="${largeImageURL}">
<div class="gallery">
    <div class="img-thumb">
        <img class="photo-card__img" src="${webformatURL}" alt="${tags}" width="301" height="210" />
    <div class="stats">
        <p class="stats-item">
            <b class="info-text">Likes</b>
            ${likes}
        </p>
        <p class="stats-item">
            <b class="info-text">Views</b>
            ${views}
        </p>
        <p class="stats-item">
            <b class="info-text">Comments</b>
            ${comments}
        </p>
        <p class="stats-item">
        <b class="info-text">Downloads</b>
            ${downloads}
        </p>
        </div>
    </div>
</div>
</a>`;
  }).join("");

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.show();
}


function clearGallery() {
    refs.gallery.innerHTML = "";
};


