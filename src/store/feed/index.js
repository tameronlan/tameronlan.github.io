import {AVATAR_STATUS_NONE, AVATAR_STATUS_DECLINED, TAB_INCOMING, TAB_MESSENGER, TAB_PROFILE} from "../../consts";

export default {
    namespaced: true,
    state: {
        visibleCards: [],
        isLoading: false,
        filter: null,
        moderationStatus: 0,
        dailyOpenLimit: 0,
        feedLimit: null,
        counters: {
            chat: 0,
            events: {
                incoming: 0,
                mutual: 0
            },
        },
        viewedCards: 0,
        viewedCardsAfterPhotoRequest: 0,
        requestPhotoChains: [5, 17],
        requestPhotoChainsIndex: 0,
        likeActionLocked: false,
        suggestions: []
    },
    getters: {
        hasCards: (state) => {
            return state.visibleCards.length > 0;
        },
        currentCard: (state, getters) => {
            return getters.hasCards ? state.visibleCards[0] : null;
        },
        totalNewNotify: (state) => {
            return state.counters.event.new + state.counters.mutual.new;
        },
        isEmpty: (state, getters) => {
            return !state.isLoading && !getters.hasCards;
        },
        hasLimit: (state, getters) => {
            return state.feedLimit != null && getters.isEmpty;
        },
        needUploadPhoto: (state) => {
            return state.moderationStatus === AVATAR_STATUS_NONE || state.moderationStatus === AVATAR_STATUS_DECLINED;
        },
        numCardsBeforeRequestPhoto: (state) => {
            return state.requestPhotoChains[state.requestPhotoChainsIndex];
        },
        tabCounter: (state, getters) => (id) => {
            switch (id) {
                case TAB_INCOMING:
                    return state.counters.events.incoming;
                case TAB_MESSENGER:
                    return state.counters.events.mutual + state.counters.chat;
                case TAB_PROFILE:
                    return 0;
            }

            return 0;
        },
        numNotify: (state) => {
            return state.counters.events.incoming + state.counters.events.mutual + state.counters.chat;
        },
        canOpenDialog: (state) => {
            return state.dailyOpenLimit > 0;
        },
        hasSupportAnswer: (state) => {
            return 0;
        }
    },
    mutations: {
        addCard: (state, card) => {
            if(state.visibleCards.length < 3){
                state.visibleCards.push(card);
            }
        },
        removeCurrentCard: (state) => {
            state.visibleCards.shift();
        },
        removeCardById: (state, id) => {
            state.visibleCards = state.visibleCards.filter(card => card.id !== id);
        },
        clear: (state) => {
            state.visibleCards.splice(0, state.visibleCards.length);
        },
        setLoading: (state, value) => {
            state.isLoading = value;
        },
        setCounters: (state, counters) => {
            state.counters = counters;
        },
        decreaseCounter: (state, type) => {
            if (state.counters[type]) {
                state.counters[type]--;
            }
        },
        decreaseEventsCounter: (state, type) => {
            if (state.counters.events[type]) {
                state.counters.events[type]--;
            }
        },
        setFilter: (state, params) => {
            state.filter = params;
        },
        setModerationStatus: (state, status) => {
            state.moderationStatus = status;
        },
        setDailyOpenLimit: (state, payload) => {
            state.dailyOpenLimit = payload;
        },
        setFeedLimit: (state, data) => {
            state.feedLimit = data;
        },
        resetFeedLimit: (state) => {
            state.feedLimit = null;
        },
        incrementViewedCards: (state) => {
            state.viewedCards++;
            state.viewedCardsAfterPhotoRequest++;
        },
        resetPhotoRequestCounter: (state) => {
            state.viewedCardsAfterPhotoRequest = 0;

            if (state.requestPhotoChainsIndex < state.requestPhotoChains.length - 1) {
                state.requestPhotoChainsIndex++;
            }
        },
        setPhotoRequestInterval: (state, payload) => {
            state.requestPhotoChains = payload;
        },
        lockLikeAction: (state) => {
            state.likeActionLocked = true;
        },
        unlockLikeAction: (state) => {
            state.likeActionLocked = false;
        },
    },
    actions: {
        init: ({commit}, payload) => {
            commit('setModerationStatus', payload.avatar_status);

            if (payload.feed && payload.feed.photo_request_interval) {
                commit('setPhotoRequestInterval', payload.feed.photo_request_interval);
            }
        }
    }
}
