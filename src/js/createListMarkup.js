import { elems } from "./elems.js";

function createListMarkup(data) {
    return data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
                
                    <div class="photo-card">
                        <a href="${webformatURL}">
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
    }).join('');
};

function cleanPage() {
    elems.divGalleryEl.innerHTML = '';
};

export { createListMarkup, cleanPage };