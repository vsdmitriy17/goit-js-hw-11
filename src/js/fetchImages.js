import axios from "axios";
// путь к API - эндпоинт, базовый URL, точка входа в API.
const BASE_URL = 'https://pixabay.com/api/'
// Ключ API
const API_KEY = '?key=25666738-83e6abd6c600844fdf6c33b5c'
// параметры настроек (выборки) запроса
const searchParams = new URLSearchParams({
    lang: "en",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    page: 1,
    per_page: 40,
});

async function fetchImages(name) {
    const dataObject = await axios.get(`${BASE_URL}${API_KEY}&q=${name}&${searchParams}`);
    console.log(dataObject);
    return dataObject;
}

// именованный экспорт ф-ции fetchImages
export { fetchImages };