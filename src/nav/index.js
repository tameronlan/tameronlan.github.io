import Vue from 'vue';
import VueNav from 'vue-navigation';
import store from '../store';

import MeetingFeed from '../components/feed/Feed';
import UserProfile from '../components/profile/UserProfile';
import Incoming from '../components/sympathy/Incoming';
import IncomingUser from '../components/sympathy/IncomingUser';
import MyProfile from '../components/profile/MyProfile';
import Start from '../components/Start';

import SignupGender from '../components/signup/SignupGender';
import SignupCity from '../components/signup/SignupCity';
import SignupName from '../components/signup/SignupName';
import SignupAge from '../components/signup/SignupAge';

import Debug from '@/components/Debug';

import {TAB_FEED, TAB_INCOMING, TAB_MESSENGER, TAB_PROFILE, TAB_NONE} from '../consts';

import Messenger from '@/components/messenger/Messenger';
import Chat from '@/components/messenger/Chat';
import Tutorial from '@/components/Tutorial';

import ExtendHandler from './ExtendHandler';

Vue.use(VueNav);

let checkAuthOnSignup = ({resolve, reject, navigation}) => {
    resolve();
};

const vueNav = new VueNav({
    baseURL: '/app/',
    defaultHandlerConstructor: ExtendHandler
}, [
    {
        name: 'root',
        path: '/',
        component: Start,
    },
    {
        path: '/signup',
        component: SignupGender,
        construct: ExtendHandler,
        willActivate: checkAuthOnSignup,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        path: '/signup_name',
        component: SignupName,
        construct: ExtendHandler,
        willActivate: checkAuthOnSignup,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        path: '/signup_age',
        component: SignupAge,
        construct: ExtendHandler,
        willActivate: checkAuthOnSignup,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        path: '/signup_city',
        component: SignupCity,
        construct: ExtendHandler,
        willActivate: checkAuthOnSignup,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE),
    },
    {
        name: 'tutorial',
        path: '/tutorial',
        construct: ExtendHandler,
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
        didActivated: () => store.commit('setNavigationTab', TAB_INCOMING),
        children: [
            {
                path: ':id',
                construct: ExtendHandler,
                component: IncomingUser
            }
        ]
    },
    {
        name: 'profile',
        path: '/profile',
        component: MyProfile,
        didActivated: () => store.commit('setNavigationTab', TAB_PROFILE)
    },
    {
        name: 'debug',
        path: '/debug',
        component: Debug,
        didActivated: () => store.commit('setNavigationTab', TAB_NONE)
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
