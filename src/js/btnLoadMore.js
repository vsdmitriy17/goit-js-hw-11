import { elems } from "./elems.js";

function btnLoadMoreAdd() {
    if (elems.btnLoadMoreEl.classList.contains('displayNone')) {
        elems.btnLoadMoreEl.classList.remove('displayNone');
    }
    return;
};

function btnLoadMoreRemove() {
    if (!elems.btnLoadMoreEl.classList.contains('displayNone')) {
        elems.btnLoadMoreEl.classList.add('displayNone');
    }
    return;
};

export { btnLoadMoreAdd, btnLoadMoreRemove };