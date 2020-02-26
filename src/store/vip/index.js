export default {
    namespaced: true,
    state: {
        hasVip: false,
        purchaseOffer: null,
        trial: null
    },
    getters: {
        trialIsAvailable: (state) => {
            return state.trial != null;
        }
    },
    mutations: {
        'setVip': (state, value) => {
            state.hasVip = value;
        },
        'setPurchaseOffer': (state, offer) => {
            state.purchaseOffer = offer;
        },
        'setTrial': (state, trial) => {
            state.trial = trial;
        }
    },
    actions: {
        'init': ({commit}, payload) => {
            commit('setVip', payload.has_vip);

            if (payload.vip_offers) {
                commit('setPurchaseOffer', payload.vip_offers.purchase);
                commit('setTrial', payload.vip_offers.trial);
            }
        }
    }
}
