import axios from "axios";
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

export default class ImgApiService {
    constructor() {
        // путь к API - эндпоинт, базовый URL, точка входа в API.
        this.BASE_URL = 'https://pixabay.com/api/';
        // Ключ API
        this.API_KEY = '?key=25666738-83e6abd6c600844fdf6c33b5c';
        // параметры настроек (выборки) запроса
        this.lang = "lang=en";
        this.image_type = "image_type=photo";
        this.orientation = "orientation=horizontal";
        this.safesearch = "safesearch=true";
        this.page = 1;
        this.per_page = 40;
        this.searchQuery = '';
    }

    async fetchImages() {
        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',}); // библ. Notiflix
        const searchParams = `${this.lang}&${this.image_type}&${this.orientation}&${this.safesearch}&page=${this.page}&per_page=${this.per_page}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.API_KEY}&q=${this.searchQuery}&${searchParams}`); // запрос через библ. axios
        console.log(dataObject);
        this.page += 1; //увеличиваем номер стр. при каждом запросе
        Loading.remove(); // библ. Notiflix
        return dataObject;
    }
    
    get query() {
        return this.searchQuery;
    }
    
    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    resetPage() {
        this.page = 1;
    }
};
