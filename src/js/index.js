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
import ImgApiService from "./ImgApiService.js";
import { lightbox } from "./openLightbox.js";
import { galleryCollectionCreate, galleryClean, galleryStartScroll } from "./gallery.js";
import { notiflixOptions, notiflixReportOptions } from "./notiflixOptions.js";

elems.formEl.addEventListener('submit', onSearchFormSubmit);
elems.divGalleryEl.addEventListener('click', onGalleryCardClick);
elems.btnLoadMoreEl.addEventListener('click', onBtnLoadMoreClick);

btnLoadMoreRemove();

const imgApiService = new ImgApiService();

async function onSearchFormSubmit(evt) {
    evt.preventDefault();
    btnLoadMoreRemove();
    const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    evt.target.reset();
    if (name === "") {
        return Notiflix.Report.warning('WORNING!', 'Please enter request.', 'Ok');
    };
    galleryClean();
    imgApiService.resetPage();
    imgApiService.searchQuery = name;
    try {

        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',});
        const dataObj = await imgApiService.fetchImages();
        Loading.remove();
        const dataImg = dataObj.data.hits;
        console.log(dataImg);

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

async function onBtnLoadMoreClick(evt) {
    try {
        elems.btnLoadMoreEl.disabled = true;

        Loading.circle({ onSearchFormSubmit: true, svgSize: '80px', });
        const dataObj = await imgApiService.fetchImages();
        Loading.remove();
        const dataImg = dataObj.data.hits;
        console.log(dataImg);

        elems.btnLoadMoreEl.disabled = false;
        
        galleryCollectionCreate(dataImg);
        galleryStartScroll();

        if (imgApiService.page > (dataObj.data.totalHits / imgApiService.per_page)) {
            btnLoadMoreRemove();
            return Notiflix.Notify.success('We are sorry, but you have reached the end of search results.');  
        };
        
    } catch (error) {
        errorCatch(error);
    };
}

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

// function createDataImg() {
//     Loading.circle({ onSearchFormSubmit: true, svgSize: '80px', });
//     const dataObj = await imgApiService.fetchImages();
//     Loading.remove();
//     const dataImg = dataObj.data.hits;
//     console.log(dataImg);
// };

function errorCatch(error) {
    console.log('❌ Worning!', error);
    Notiflix.Notify.failure('❌ Worning! ERROR!');
    Loading.remove();
}
