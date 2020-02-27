import { NavigationHandler } from "navigation";
import store from "../store/";
import Popup from '../popups/Popup';
import Vue from 'vue';
import vueNav from '../nav/';

export default class ExtendHandler extends NavigationHandler {
    activate({ animated, intent }) {
        let rand = Math.floor(Math.random());

        redirect('/feed');

        debugger;

        if (rand === 0){
            return;
        }

        if (this.component) {
            throw new Error('ExtendHandler: Component already created');
        }

        var _this = this;

        this.component = Object.assign(
            {},
            this.config.component,
            {
                nav: vueNav,
                mixins: [{
                    beforeCreate() {
                        _this.component = this;
                    }
                }]
            }
        );

        let advancedOptions = this.config.advancedOptions || {};

        this.extend = new Popup({
            component: this.component,
            options: {
                myClass: 'popup_extend',
                ...advancedOptions
            }
        });

        store.dispatch('popups/openPopup', { popup: this.extend, animated });

        if (this.config.didActivated) {
            this.config.didActivated(intent);
        }
    }
    unload({ animated, intent }) {
        if (!this.extend) {
            return;
        }

        store.dispatch('popups/closePopup', { popup: this.extend, animated });

        this.extend = null;
        this.component = null;

        if (this.config.didUnloaded) {
            this.config.didUnloaded(intent);
        }
    }
    update({intent}) {
        if(intent.options.ignoreUpdate) {
            return;
        }

        if(this.component) {
            this.component.navUpdated && this.component.navUpdated();
        }
    }
    append(childComponent) {
        if (!this.component) {
            throw new Error('ExtendContainer: No component');
        }

        Vue.nextTick(() => { // Wait actual component (see mixin above)
            this.component.navViewComponent = childComponent;
        });
    }
    remove() {
        if (!this.component) {
            throw new Error('ExtendContainer: No component');
        }

        Vue.nextTick(() => { // Wait actual component (see mixin above)
            if (this.component) {
                this.component.navViewComponent = null;
            }
        });
    }
}
