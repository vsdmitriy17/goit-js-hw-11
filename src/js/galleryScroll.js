
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// элементы, классы, ф-ции
import { elems } from "./elems.js";
import { bgImageRemove, bgImageAdd } from "./bgImage.js"
import { btnLoadMoreAdd, btnLoadMoreRemove } from "./btnLoadMore.js";
import ImgApiService from "./ImgApiService.js";
import { errorCatch } from "./errorCatch.js";
import { lightbox } from "./openLightbox.js";
import { galleryCollectionCreate, galleryClean } from "./galleryCreate.js";
import { notiflixOptions, notiflixReportOptions } from "./notiflixOptions.js";
import { imgApiService } from "./index.js"

async function galleryScroll() {
    const block = elems.divGalleryEl;        
    const contentHeight = block.offsetHeight;      // 1) высота блока контента вместе с границами
    const yOffset = window.pageYOffset;      // 2) текущее положение скролбара
    const window_height = window.innerHeight;      // 3) высота внутренней области окна документа
    let y = yOffset + window_height;
            
    // если пользователь достиг конца
    if (y >= contentHeight) {
        //загружаем новое содержимое в элемент
        const dataObj = await imgApiService.fetchImages();
        const dataImg = dataObj.data.hits;
        galleryCollectionCreate(dataImg);
        console.log(imgApiService.page);

        if (dataImg.length !== 0 && imgApiService.page > (dataObj.data.totalHits / imgApiService.per_page)) {
            window.removeEventListener("scroll", galleryScroll);
            return Notiflix.Notify.success('We are sorry, but you have reached the end of search results.');
        };
    };
};

function galleryStartScroll() {
    const { height: cardHeight } = elems.divGalleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight*2,
        behavior: 'smooth',
    });
};

export { galleryScroll, galleryStartScroll };