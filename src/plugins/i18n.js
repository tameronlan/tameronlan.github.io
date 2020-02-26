import Vue from 'vue';
import VueI18n from 'vue-i18n';
import ru_RU from '../lang/ru_RU.json';
import en_US from '../lang/en_US.json';

import {DEFAULT_LANGUAGE, FALLBACK_LANGUAGE} from '../consts';

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: DEFAULT_LANGUAGE,
    fallbackLocale: FALLBACK_LANGUAGE,
    messages: {ru_RU, en_US}
});
