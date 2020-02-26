import {i18n} from '../../plugins/i18n';

export default {
    namespaced: true,
    state: {
        messages: []
    },
    getters: {
        hasCards: (state) => {
            return state.visibleCards;
        }
    },
    mutations: {
        'initMessages': (state, messages) => {
            if (messages.length === 0) {
                messages.push({
                    id: 0,
                    message: i18n.t('support_chat.message'),
                    from: 'user'
                });
            }

            state.messages = messages.reverse();
        },
        'addMessage': (state, message) => {
            state.messages.push(message);
        }
    },
    actions: {

    }
}
