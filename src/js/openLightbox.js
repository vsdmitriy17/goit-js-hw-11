import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//Ф-ция - создает и открывает слайдер (lightbox - библиотека SimpleLightbox, класс SimpleLightbox, метод open()), с оригинальными (большими - original) изображениями;
//     свойства - для описания изображений (подпись изображений):
//             captionSelector - указывает элемент который содержит описание
//             captionType - указывает где именно в элементе находится описание (атрибут, дата-атрибут, текст)
//             captionsData - указывает в каком атрибуте хранится описание
//             captionPosition - указывает положение описания (вверху, внизу, за пределами изображения)
//             captionDelay - указывает задержку появления подписи
//             enableKeyboard - позволяет навигацию с клавиатуры (<- ->) и выход при нажатии Esc

    let lightbox = new SimpleLightbox(".photo-card a",
        {
            captionSelector: 'img',
            captionType: 'attr',
            captionsData: 'alt',
            captionPosition: 'bottom',
            captionDelay: 250,
            enableKeyboard: true,
        });


export { lightbox };