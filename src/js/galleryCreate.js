import { elems } from "./elems.js";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { lightbox } from "./openLightbox.js";

function galleryCollectionCreate(data) {
    elems.divGalleryEl.insertAdjacentHTML('beforeend',
        (data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
                
                    <div class="photo-card">
                        <a href="${largeImageURL}">
                            <img class="card" src="${webformatURL}" alt="${tags}" loading="lazy" />
                        </a>
                        <div class="info">
                            <p class="info-item">
                                <b>Likes:</b> ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views:</b> ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments:</b> ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads:</b> ${downloads}
                            </p>
                        </div>
                    </div>
                `;
        }).join('')));
    lightbox.refresh();
};

function galleryClean() {
    elems.divGalleryEl.innerHTML = '';
};

export { galleryCollectionCreate, galleryClean };