import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//Ф-ция - создает и открывает слайдер (lightbox - библиотека SimpleLightbox, класс SimpleLightbox, метод open()), с оригинальными (большими - original) изображениями;
//     свойства - для описания изображений (подпись изображений):
//             captionsData - указывает в каком атрибуте хранится описание
//             captionPosition - указывает положение описания (вверху, внизу, за пределами изображения)
//             captionDelay - указывает задержку появления подписи
//             enableKeyboard - позволяет навигацию с клавиатуры (<- ->) и выход при нажатии Esc

    let lightbox = new SimpleLightbox(".gallery a",
        {
            captionsData: 'alt',
            captionPosition: 'bottom',
            captionDelay: 250,
            enableKeyboard: true,
        });


export { lightbox };