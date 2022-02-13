import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

function errorCatch(error) {
    console.log('❌ Worning!', error);
    Notiflix.Notify.failure('❌ Worning! ERROR!');
    Loading.remove();
}

export { errorCatch };