import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {i18n} from './plugins/i18n';
import nav from './nav/';
import api from './api/instance';
import touchDirective from './lib/touchDirective';
import fileDirective from './lib/fileDirective';
import pluralFilter from './lib/pluralFilter';
import counterLimit from './lib/counterLimit';
import nativeStat from './lib/statistic/nativeStat';
import push from './push';
import ComponentView from './lib/ComponentView';
import { longClickDirective } from 'vue-long-click'
import Toasted from 'vue-toasted';

import './scss/main.scss';

Vue.config.productionTip = false;

const longClickInstance = longClickDirective({delay: 1000, interval: 0});

// Components
Vue.component('ComponentView', ComponentView);

// Directives
Vue.directive('touch', touchDirective);
Vue.directive('file-upload', fileDirective);
Vue.directive('longclick', longClickInstance);

// Filters
Vue.filter('plural', pluralFilter);
Vue.filter('counterLimit', counterLimit);

// Modules
Vue.use(api);
Vue.use(nativeStat);
Vue.use(push);
Vue.use(Toasted, {
    position: 'bottom-center',
    duration: 2000
});

new Vue({
    el: '#app',
    store,
    i18n,
    nav: nav,
    render: h => h(App)
});
