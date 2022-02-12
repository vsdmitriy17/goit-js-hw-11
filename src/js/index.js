import '../sass/main.scss';
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { elems } from "./elems.js";
import ImgApiService from "./fetchImages.js";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { openLightbox } from "./openLightbox.js";
import { createListMarkup, cleanGallery } from "./createListMarkup.js";
import { notiflixOptions } from "./notiflixOptions.js";

elems.formEl.addEventListener('submit', onSearchFormSubmit);
elems.divGalleryEl.addEventListener('click', onGalleryCardClick);
elems.btnLoadMoreEl.addEventListener('click', onBtnLoadMoreClick);

elems.btnLoadMoreEl.classList.add('displayNone');

const imgApiService = new ImgApiService();

async function onSearchFormSubmit(evt) {
    evt.preventDefault();
    if (!elems.btnLoadMoreEl.classList.contains('displayNone')) {
        elems.btnLoadMoreEl.classList.add('displayNone');
    };
    const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    evt.target.reset();
    if (name === "") {
        return Notiflix.Report.warning('WORNING!', 'Please enter request', 'Ok');
    };
    cleanGallery();
    imgApiService.resetPage();
    imgApiService.searchQuery = name;
    try {

        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',});
        const dataObj = await imgApiService.fetchImages();
        Loading.remove();
        const dataImg = dataObj.data.hits;
        console.log(dataImg);

        if (dataImg.length === 0) {
            return Notiflix.Notify.success('Sorry, there are no images matching your search query. Please try again.');  
        };
        Notiflix.Notify.success(`Hooray! We found ${dataObj.data.totalHits} images.`);
        elems.btnLoadMoreEl.classList.remove('displayNone');
        return elems.divGalleryEl.insertAdjacentHTML('beforeend', createListMarkup(dataImg));
    } catch (error) {
        console.log('❌ Worning!', error);
        Notiflix.Notify.failure('❌ Worning! ERROR!');
        Loading.remove();
    };
};

async function onBtnLoadMoreClick(evt) {
    try {
        elems.btnLoadMoreEl.disabled = true;

        Loading.circle({ onSearchFormSubmit: true, svgSize: '80px', });
        const dataObj = await imgApiService.fetchImages();
        Loading.remove();
        const dataImg = dataObj.data.hits;
        console.log(dataImg);

        elems.btnLoadMoreEl.disabled = false;
        if (imgApiService.page > (dataObj.data.totalHits / imgApiService.per_page)) {
            elems.btnLoadMoreEl.classList.add('displayNone');
            return Notiflix.Notify.success('We are sorry, but you have reached the end of search results.');  
        };
        return elems.divGalleryEl.insertAdjacentHTML('beforeend', createListMarkup(dataImg));
    } catch (error) {
        console.log('❌ Worning!', error);
        Notiflix.Notify.failure('❌ Worning! ERROR!');
        Loading.remove();
    };
}

//Ф-ция:
//     отменяет действия браузера по умолчанию;
//     проверяет условие клика по элементу img (не реагирует на клик на др элементы);
//     открывает слайдер (lightbox)    
function onGalleryCardClick(evt) {
    evt.preventDefault();
    if(!evt.target.classList.contains('card')) {
        return;
    }
    openLightbox();
};

// function createDataImg() {
//     Loading.circle({ onSearchFormSubmit: true, svgSize: '80px', });
//     const dataObj = await imgApiService.fetchImages();
//     Loading.remove();
//     const dataImg = dataObj.data.hits;
//     console.log(dataImg);
// };
