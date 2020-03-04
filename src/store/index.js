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
            id: 100,
            name: 'me',
            gender: 'm',
            age: '31',
            avatars: {
                s1: 'https://sun9-21.userapi.com/c847220/v847220850/ad672/5Luku6GutMw.jpg',
                s2: 'https://sun9-21.userapi.com/c847220/v847220850/ad672/5Luku6GutMw.jpg',
                s3: 'https://sun9-21.userapi.com/c847220/v847220850/ad672/5Luku6GutMw.jpg',
                s4: 'https://sun9-21.userapi.com/c847220/v847220850/ad672/5Luku6GutMw.jpg',
                s5: 'https://sun9-21.userapi.com/c847220/v847220850/ad672/5Luku6GutMw.jpg',
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
