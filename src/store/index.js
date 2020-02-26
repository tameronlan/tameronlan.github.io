import Vue from 'vue';
import Vuex from 'vuex';

import popups from './popups';
import feed from './feed';
import vip from './vip';
import interstitials from './interstitials';
import messenger from './messenger';
import signup from './signup';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: null,
        currentTabId: 0,
        bannerIsShown: true,
    },
    getters: {},
    mutations: {
        updateUserAvatar: (state, payload) => {
            state.config.user.avatars = payload;
        },
        setNavigationTab: (state, id) => {
            state.currentTabId = id;
        },
        setBannerVisible: (state, payload) => {
            state.bannerIsShown = payload;
        },
    },
    actions: {},
    modules: {
        popups,
        feed,
        vip,
        interstitials,
        messenger,
        signup
    }
});
