import bottomBanner from '../../advert/bottomBanner';

export default {
    namespaced: true,
    state: {
        popups: []
    },
    getters: {},
    mutations: {
        addPopup(state, popup) {
            state.popups.push(popup);
        },
        removePopup(state, popup) {
            for (let i = 0; i < state.popups.length; i++) {
                if (state.popups[i] === popup) {
                    state.popups.splice(i, 1);
                    break;
                }
            }
        }
    },
    actions: {

        // MEANING:
        // open - add a popup instance to the stack
        // close - remove a popup instance from the stack
        // show - display a popup content
        // hide - hide a popup content

        openPopup({state, commit}, {popup, animated}) {
            popup.options.showAnimated = animated;

            commit('addPopup', popup);

            let popups = state.popups;
            let hasExtends = popups.some(item => {
                return item.options && item.options.myClass && item.options.myClass === 'popup_extend' && !item.options.ignoreBottomBanner;
            });

            if (hasExtends) {
                bottomBanner.hide();
            }
        },
        closePopup({state, commit}, {popup, animated, onClose}) {
            const popups = state.popups;

            for (let i = 0; i < popups.length; i++) {
                if (popups[i] === popup) {
                    popups[i].hide(animated).then(() => {
                        commit('removePopup', popup);

                        let hasExtends = popups.some(item => {
                            return item.options && item.options.myClass && item.options.myClass === 'popup_extend' && !item.options.ignoreBottomBanner;
                        });

                        if (!hasExtends) {
                            bottomBanner.show();
                        }

                        onClose && onClose();
                    });

                    break;
                }
            }
        }
    }
};
