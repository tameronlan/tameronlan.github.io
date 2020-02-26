import Popup from './Popup';
import store from '@/store/';
import Component from '@/components/photoviewer/Photoviewer';

export default {
    open({ fetch, initialId, user, urlAlias, onUpdate, editable, animated }) {
        if (typeof animated === 'undefined') {
            animated = true;
        }

        const popup = new Popup({
            component: Component,
            props: {
                fetch,
                initialId,
                urlAlias,
                onUpdate,
                editable,
                user
            },
            options: {
                myClass: 'popup_extend'
            }
        });

        store.dispatch('popups/openPopup', { popup, animated });

        return popup;
    },
    close(popup, animated = true, onClose) {
        store.dispatch('popups/closePopup', {
            popup,
            animated,
            onClose
        });
    }
};
