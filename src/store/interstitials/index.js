import {getVendor} from '../../lib/browser';
import {VENDOR_ANDROID, VENDOR_IOS} from '../../consts';

export default {
    namespaced: true,
    state: {
        showLoader: false,
        placements: {
            'ios': {
                feed: 52853,
                profile: 52854,
                banner: 52854
            },
            'android': {
                feed: 53125,
                profile: 53124,
                banner: 52854
            }
        }
    },
    getters: {
        placementIds(state) {
            switch (getVendor()) {
                case VENDOR_IOS:
                    return state.placements.ios;
                case VENDOR_ANDROID:
                default:
                    return state.placements.android;
            }
        }
    },
    mutations: {
        'showLoader': state => {
            state.showLoader = true;
        },
        'hideLoader': state => {
            state.showLoader = false;
        }
    }
}