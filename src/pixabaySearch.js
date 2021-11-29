import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class PixApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };

    //24558564-a16a5722e1280d44cb84f27e6
     fetchArticles() {

        return fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=40&key=24558564-a16a5722e1280d44cb84f27e6`)
            .then(response => {
                if (!response.ok) {
                    return Notify.failure('Something went wrong');
                };
                return response.json();
            })
            .then(data => {
                this.incrementPage();
                if (data.hits.length === 0) {
                    return Notify.failure('Information not found');
                };
                return data.hits;
            });
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        return this.searchQuery = newQuery;
    }

    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
}