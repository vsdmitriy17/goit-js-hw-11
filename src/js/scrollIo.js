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

function galleryScrollIo() {
    const obsOptions = {
            rootMargin: '100px',
        };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
                const dataObj = await imgApiService.fetchImages();
                const dataImg = dataObj.data.hits;
                galleryCollectionCreate(dataImg);
                console.log(imgApiService.page);

                if (dataImg.length !== 0 && imgApiService.page > (dataObj.data.totalHits / imgApiService.per_page)) {
                    observer.disconnect();
                    return Notiflix.Notify.success('We are sorry, but you have reached the end of search results.');
                };
            };
        });
    }, obsOptions);

    observer.observe(elems.sentinelEl);
};

function sentinelElAdd () {
    if (elems.sentinelEl.classList.contains('sentinel')) {
        elems.sentinelEl.classList.remove('sentinel');
    };
    return;
};

function sentinelElRemove () {
    if (!elems.sentinelEl.classList.contains('sentinel')) {
        elems.sentinelEl.classList.add('sentinel');
    };
    return;
};

function observerDiconnect() {
    if (observer) {
        observer.disconnect();
    };
};


export { galleryScrollIo, sentinelElAdd, sentinelElRemove, observerDiconnect };