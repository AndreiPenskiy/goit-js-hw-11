import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixApiService from './pixabaySearch';
import articlesTpl from './templates/articlesTpl.hbs'
import LoadMoreBtn from './loadMoreBtn.js'
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';


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
const lightbox = new SimpleLightbox('.gallery-item a', { captionsData:'alt', captionDelay:250 });
lightbox.refresh();


refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);


function onSearch(e) {
    e.preventDefault();

  pixApiService.query = e.currentTarget.elements.query.value.trim();

  if (pixApiService.query === '') {
    return Notify.failure('Введи что-нибудь!');
  }

    loadMoreBtn.show();
    pixApiService.resetPage();
    clearGallery();
    fetchArticles();
};

function fetchArticles() {
  loadMoreBtn.hide();
  pixApiService.fetchArticles().then(articles => {
    appendArticlesMarkup(articles);
    lightbox.refresh();
    loadMoreBtn.show();
  });
}


function appendArticlesMarkup(articles) {
  refs.gallery.insertAdjacentHTML('beforeend', articlesTpl(articles));
  lightbox.refresh();
}


function clearGallery() {
    refs.gallery.innerHTML = "";
};


