import Popup from '@/popups/Popup';
import store from '@/store/';
import Component from '@/components/popups/AlertDialog';
import vueNav from '@/nav/';

export default {
    open(props = {}) {
        if (props.animated === 'undefined') {
            props.animated = true;
        }

        const popup = new Popup({
            component: Component,
            props: props,
            options: {
                myClass: 'alert-dialog'
            }
        });

        return new Promise(resolve => {
            vueNav.nav.pushInstant({
                unloadOther: false,
                activate: animated => {
                    store.dispatch('popups/openPopup', {popup, animated});
                },
                unload: (animated, options) => {
                    store.dispatch('popups/closePopup', {
                        popup,
                        animated,
                        onClose: resolve(options)
                    });
                }
            });
        });
    },
    close(popup, animated = true, onClose) {
        store.dispatch('popups/closePopup', {
            popup,
            animated,
            onClose
        });
    }
};
