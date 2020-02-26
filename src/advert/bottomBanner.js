import bridge from '../bridge';
import store from '../store';

let params;
let isShown = false;

const instance = {
    init(data) {
        params = data;
    },
    show() {
        let hasVip = store.state.vip.hasVip;

        if(params && !hasVip && !isShown) {
            bridge.invokeNative('change_bottom_banner_state', {
                isShow: true,
                placeId: params.place_id,
                params: params.params
            });

            isShown = true;

            store.commit('setBannerVisible', true);
        }
    },
    hide() {
        if(params) {
            bridge.invokeNative('change_bottom_banner_state', {
                isShow: false,
                placeId: params.place_id,
                params: params.params
            });

            isShown = false;
            store.commit('setBannerVisible', false);
        }
    }
};

export default instance;