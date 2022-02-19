import '../sass/main.scss';
//Библиотеки Notiflix, SimpleLightbox
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// элементы, классы, ф-ции
import { elems } from "./elems.js";
import { bgImageRemove, bgImageAdd } from "./bgImage.js"
import { btnLoadMoreAdd, btnLoadMoreRemove } from "./btnLoadMore.js";
import { galleryScroll, galleryStartScroll } from "./galleryScroll.js"
import ImgApiService from "./ImgApiService.js";
import { errorCatch } from "./errorCatch.js";
import { galleryScrollIo, sentinelElAdd, sentinelElRemove, observerDiconnect } from "./scrollIo.js"
import { lightbox } from "./openLightbox.js";
import { galleryCollectionCreate, galleryClean } from "./galleryCreate.js";
import { notiflixOptions, notiflixReportOptions } from "./notiflixOptions.js";

elems.formEl.addEventListener('submit', onSearchSubmit);
elems.btnLoadMoreEl.addEventListener('click', onBtnLoadMoreClick);
elems.divGalleryEl.addEventListener('click', onGalleryCardClick);


btnLoadMoreRemove();
sentinelElRemove();

const imgApiService = new ImgApiService();

// Колбек ф-ция события 'submit' на элементе formEl:
//     1) отменяет действия браузера по умолчанию;
//     2) если в группе радиобатаннов выбрана "Button" - вызывает ф-цию onSearchFormSubmit(evt);
//        иначе - ф-цию onSearchFormScroll(evt)
function onSearchSubmit(evt) {
    evt.preventDefault();
    if (evt.currentTarget.elements.functions.value === 'onBtn') {
        return onSearchFormSubmit(evt);
    } else if (evt.currentTarget.elements.functions.value === 'onScroll') { 
        return onSearchFormScroll(evt);
    };
    return onSearchFormScrollIo(evt);
};

// Ф-ция события 'submit' на элементе formEl:
//     1) выключает кнопку btnLoadMore (если она включена)
//     2) проверяет если текущее значение поля input (name):
//          - пустая строка, то выводит на экран сообщение "WORNING!', 'Please enter request.";
//          - иначе:
//                 1. присваивает значение "name" параметру "searchQuery" объекта imgApiService;
//                 2. очищает поле input;
//                 3. возвращает дефолтное занчение параметра "рage" объекта imgApiService
//                 4. отправляет запрос на API, по "searchQuery" и получает объект данных "dataObj", выводит в консоль "dataObj"
//                 5. выбирает массив данных для отрисовки "dataImg", выводит в консоль "dataImg"
//                 6. проверяет если "dataImg":
//                      - пуст, то выводит на экран сообщение 'Sorry, there are no images matching your search query. Please try again.',
//                        возвращает стартовое изображение и текст (если их не было)
//                      - иначе, убирает стартовое изображение и текст (если они были),
//                        выводит на экран сообщение `Hooray! We found ${кол-во найденных изображений} images.`,
//                        включает кнопку btnLoadMore (если она выключена),
//                        отрисовывает галерею изображений.
//     3) если во время запроса произошла ошибка - выводит сообщение в консоль и на экран
async function onSearchFormSubmit(evt) {
    btnLoadMoreRemove();
    sentinelElRemove();
    window.removeEventListener("scroll", galleryScroll);
    const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    if (name === "") {
        return Notiflix.Report.warning('WORNING!', 'Please enter request.', 'Ok');
    };
    evt.target.reset();
    galleryClean();
    imgApiService.resetPage();
    imgApiService.searchQuery = name;

    try {
        const dataObj = await imgApiService.fetchImages();
        const dataImg = dataObj.data.hits;

        if (dataImg.length === 0) {
            bgImageAdd();
            return Notiflix.Notify.success('Sorry, there are no images matching your search query. Please try again.');  
        };

        bgImageRemove();
        Notiflix.Notify.success(`Hooray! We found ${dataObj.data.totalHits} images.`);
        btnLoadMoreAdd();
        galleryCollectionCreate(dataImg);
        
    } catch (error) {
        errorCatch(error);
    };
};

// Колбек ф-ция события 'submit' на элементе formEl:
//     1. деактивирует кнопку btnLoadMoreEl;
//     2. отправляет запрос на API, по "searchQuery" и получает объект данных "dataObj", выводит в консоль "dataObj"
//     3. выбирает массив данных для отрисовки "dataImg", выводит в консоль "dataImg"
//     4. активирует кнопку btnLoadMoreEl;
//     5. отрисовывает галерею изображений.
//     6. скролит экран на высоту в две карточки галереи
//     7. если номер текущего запроса больше отношения колва всех стр. в API, к кол-ву элементов в одном запросе, то:
//        - выключает кнопку btnLoadMoreEl
//        - выводит на экран сообщение 'We are sorry, but you have reached the end of search results.'
//     8. если во время запроса произошла ошибка - выводит сообщение в консоль и на экран
async function onBtnLoadMoreClick(evt) {
    try {
        elems.btnLoadMoreEl.disabled = true;
        const dataObj = await imgApiService.fetchImages();
        const dataImg = dataObj.data.hits;
        galleryCollectionCreate(dataImg);
        galleryStartScroll();
        elems.btnLoadMoreEl.disabled = false;

        if (imgApiService.page > (dataObj.data.totalHits / imgApiService.per_page)) {
            btnLoadMoreRemove();
            return Notiflix.Notify.success('We are sorry, but you have reached the end of search results.');  
        };
    } catch (error) {
        errorCatch(error);
    };
};

// Колбек ф-ция события 'submit' на элементе formEl:
//     1) выключает кнопку btnLoadMore (если она включена)
//     2) проверяет если текущее значение поля input (name):
//          - пустая строка, то выводит на экран сообщение "WORNING!', 'Please enter request.";
//          - иначе:
//                 1. присваивает значение "name" параметру "searchQuery" объекта imgApiService;
//                 2. очищает поле input;
//                 3. возвращает дефолтное занчение параметра "рage" объекта imgApiService
//                 4. отправляет запрос на API, по "searchQuery" и получает объект данных "dataObj", выводит в консоль "dataObj"
//                 5. выбирает массив данных для отрисовки "dataImg", выводит в консоль "dataImg"
//                 6. проверяет если "dataImg":
//                      - пуст, то выводит на экран сообщение 'Sorry, there are no images matching your search query. Please try again.',
//                        возвращает стартовое изображение и текст (если их не было)
//                      - иначе, убирает стартовое изображение и текст (если они были),
//                        выводит на экран сообщение `Hooray! We found ${кол-во найденных изображений} images.`,
//                        отрисовывает галерею изображений,
//                      - вешает слушателя события "scroll" на объект window, который вызывает кол-бек ф-цию galleryScroll (делает запрос на API,
//                        отрисосвывает очередную коллекцию "gallery", по мере скрола стр.)
//     3) если во время запроса произошла ошибка - выводит сообщение в консоль и на экран
async function onSearchFormScroll(evt) {
    btnLoadMoreRemove();
    sentinelElRemove();
    const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    if (name === "") {
        return Notiflix.Report.warning('WORNING!', 'Please enter request.', 'Ok');
    };
    elems.inputEl.value = "";
    galleryClean();
    imgApiService.resetPage();
    imgApiService.searchQuery = name;

    try {
        const dataObj = await imgApiService.fetchImages();
        const dataImg = dataObj.data.hits;

        if (dataImg.length === 0) {
            window.removeEventListener("scroll", galleryScroll);
            bgImageAdd();
            return Notiflix.Notify.success('Sorry, there are no images matching your search query. Please try again.');  
        };

        bgImageRemove();
        Notiflix.Notify.success(`Hooray! We found ${dataObj.data.totalHits} images.`);
        galleryCollectionCreate(dataImg);

        window.addEventListener("scroll", galleryScroll);
    } catch (error) {
        errorCatch(error);
    };
};

async function onSearchFormScrollIo(evt) {
    btnLoadMoreRemove();
    sentinelElRemove();
    window.removeEventListener("scroll", galleryScroll);
    const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    if (name === "") {
        return Notiflix.Report.warning('WORNING!', 'Please enter request.', 'Ok');
    };
    elems.inputEl.value = "";
    galleryClean();
    imgApiService.resetPage();
    imgApiService.searchQuery = name;

    try {
        const dataObj = await imgApiService.fetchImages();
        const dataImg = dataObj.data.hits;

        if (dataImg.length === 0) {
            window.removeEventListener("scroll", galleryScroll);
            bgImageAdd();
            return Notiflix.Notify.success('Sorry, there are no images matching your search query. Please try again.');  
        };

        bgImageRemove();
        Notiflix.Notify.success(`Hooray! We found ${dataObj.data.totalHits} images.`);
        galleryCollectionCreate(dataImg);

        sentinelElAdd();
        galleryScrollIo();

    } catch (error) {
        errorCatch(error);
    };
};

// Колбек ф-ция события 'click' на элементе btnLoadMoreEl:
//     отменяет действия браузера по умолчанию;
//     проверяет условие клика по элементу img (не реагирует на клик на др элементы);
//     открывает слайдер (lightbox)    
function onGalleryCardClick(evt) {
    evt.preventDefault();
    if(!evt.currentTarget.classList.contains('card')) {
        return;
    }
    lightbox.open();
};

export { imgApiService };