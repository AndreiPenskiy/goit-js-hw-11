import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';



export default class PixApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };

    //24558564-a16a5722e1280d44cb84f27e6
    async fetchArticles() {
        const BASE_URL = 'https://pixabay.com';
        const KEY = '24558564-a16a5722e1280d44cb84f27e6';
        const getImage = await axios.get(`${BASE_URL}/api/?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=40`)
        return getImage;
        this.incrementPage();
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