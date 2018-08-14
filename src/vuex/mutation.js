export default {
    ['CATCH_IMG'](state, img) {
        state.catch_img[img.name] = img.value;
    }
}