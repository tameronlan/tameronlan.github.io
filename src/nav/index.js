import Vue from 'vue';
import VueNav from 'vue-navigation';
import store from '../store';

import MeetingFeed from '../components/feed/Feed';
import UserProfile from '../components/profile/UserProfile';
import Incoming from '../components/sympathy/Incoming';
import MyProfile from '../components/profile/MyProfile';
import Start from '../components/Start';

import SignupGender from '../components/signup/SignupGender';
import SignupCity from '../components/signup/SignupCity';
import SignupName from '../components/signup/SignupName';
import SignupAge from '../components/signup/SignupAge';

import {TAB_FEED, TAB_INCOMING, TAB_MESSENGER, TAB_PROFILE, TAB_NONE} from '../consts';

import Messenger from '@/components/messenger/Messenger';
import Chat from '@/components/messenger/Chat';
import Tutorial from '@/components/Tutorial';

import ExtendHandler from './ExtendHandler';

Vue.use(VueNav);

const vueNav = new VueNav({baseURL: '/app/'}, [
    {
        name: 'root',
        path: '/',
        component: Start,
    },
    {
        path: '/signup',
        component: SignupGender,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        path: '/signup_name',
        component: SignupName,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        path: '/signup_age',
        component: SignupAge,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        path: '/signup_city',
        component: SignupCity,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        name: 'tutorial',
        path: '/tutorial',
        component: Tutorial,
    },
    {
        name: 'feed',
        path: '/feed',
        component: MeetingFeed,
        didActivated: () => store.commit('setNavigationTab', TAB_FEED),
        children: [
            {
                path: 'profile',
                construct: ExtendHandler,
                component: UserProfile
            }
        ]
    },
    {
        name: 'messenger',
        path: '/messenger',
        component: Messenger,
        didActivated: () => store.commit('setNavigationTab', TAB_MESSENGER),
        children: [
            {
                path: ':id',
                construct: ExtendHandler,
                component: Chat
            }
        ]
    },
    {
        name: 'incoming',
        path: '/incoming',
        component: Incoming,
        didActivated: () => store.commit('setNavigationTab', TAB_INCOMING)
    },
    {
        name: 'profile',
        path: '/profile',
        component: MyProfile,
        didActivated: () => store.commit('setNavigationTab', TAB_PROFILE)
    }
]);

store.registerModule('nav', {
    state: {
        record: null,
        intent: null
    }
});

vueNav.nav.eventBus.on('active', function ({record, intent}) {
    store.state.nav.intent = intent;
    store.state.nav.record = record;
});

export default vueNav;
