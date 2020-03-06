import Vue from 'vue';
import Vuex from 'vuex';

import popups from './popups';
import feed from './feed';
import vip from './vip';
import interstitials from './interstitials';
import messenger from './messenger';
import signup from './signup';
import common from './common';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        config: null,
        currentUser: {
            id: 0,
            name: '',
            gender: '',
            age: 0,
            avatars: {
                s1: '',
                s2: '',
                s3: '',
                s4: '',
                s5: '',
            }
        },
        currentTabId: 0,
        bannerIsShown: true,
    },
    getters: {},
    mutations: {
        setNavigationTab: (state, id) => {
            state.currentTabId = id;
        },
        setBannerVisible: (state, payload) => {
            state.bannerIsShown = payload;
        },
        setCurrentUser: (state, payload) => {
            console.log(payload);

            state.currentUser = payload;
        },
        updateUserAvatar: (state, payload) => {
            state.currentUser.avatars = payload;
        },
    },
    actions: {},
    modules: {
        popups,
        feed,
        vip,
        interstitials,
        messenger,
        signup,
        common
    }
});
