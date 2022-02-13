import { elems } from "./elems.js";

function bgImageRemove() {
    if (elems.bodyEl.classList.contains('overlay')) {
        elems.pageTitle.classList.add('isHidden');
        elems.bodyEl.classList.remove('overlay');
    }
    return;
};

function bgImageAdd() {
    if (!elems.bodyEl.classList.contains('overlay')) {
        elems.pageTitle.classList.remove('isHidden');
        elems.bodyEl.classList.add('overlay');
    }
    return;
};

export { bgImageRemove, bgImageAdd };