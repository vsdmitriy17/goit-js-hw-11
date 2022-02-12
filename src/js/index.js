import '../sass/main.scss';
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from "./fetchImages.js";
import { notiflixOptions } from "./notiflixOptions.js";

const formEl = document.querySelector('form#search-form');
const inputEl = document.querySelector('.form__input');
const btnSearchEl = document.querySelector('.form__btn');
const divGalleryEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

//btnDisable();

formEl.addEventListener('submit', onSearchFormSubmit);
divGalleryEl.addEventListener('click', onGalleryCardClick);

async function onSearchFormSubmit(evt) {
    evt.preventDefault();
    const name = inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    btnDisable();

    try {
        const dataObj = await fetchImages(name);
        const dataImg = dataObj.data.hits;
        console.log(dataImg);
        if (dataImg.length === 0) {
            return Notiflix.Notify.success('Sorry, there are no images matching your search query. Please try again.');  
        }
        Notiflix.Notify.success(`Hooray! We found ${dataObj.data.totalHits} images.`);
        return divGalleryEl.insertAdjacentHTML('beforeend', createListMarkup(dataImg));

    } catch (error) {
        console.log('❌ Worning!', error);
        Notiflix.Notify.failure('❌ Worning! ERROR!');
    }
};

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

//Ф-ция - создает и открывает слайдер (lightbox - библиотека SimpleLightbox, класс SimpleLightbox, метод open()), с оригинальными (большими - original) изображениями;
//     свойства - для описания изображений (подпись изображений):
//             captionSelector - указывает элемент который содержит описание
//             captionType - указывает где именно в элементе находится описание (атрибут, дата-атрибут, текст)
//             captionsData - указывает в каком атрибуте хранится описание
//             captionPosition - указывает положение описания (вверху, внизу, за пределами изображения)
//             captionDelay - указывает задержку появления подписи
//             enableKeyboard - позволяет навигацию с клавиатуры (<- ->) и выход при нажатии Esc
function openLightbox() {
    let lightbox = new SimpleLightbox('.photo-card a',
        {
            captionSelector: 'img',
            captionType: 'attr',
            captionsData: 'alt',
            captionPosition: 'bottom',
            captionDelay: 250,
            enableKeyboard: true,
        });
    lightbox.open();
};

// function cleanPage() {
//     divCardEl.innerHTML = '';
//     ulCardsEl.innerHTML = '';
// };

// Ф-ция проверяет заполнение полей формы, если все поля заполнены - кнопка активна, если хотя бы одно поле пусто - кнопка неактивна
function btnDisable() {
    if (inputEl.value.trim() === "") {
        return btnSearchEl.disabled = true;
    }
    return btnSearchEl.disabled = false;
};
