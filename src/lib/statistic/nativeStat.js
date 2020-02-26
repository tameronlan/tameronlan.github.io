import bridge from '../../bridge';

const nativeStat = {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$nativeStat', {
            get() {
                return nativeStat;
            }
        });
    },
    trackMetricaEvent(name, params = {}) {
        bridge.invokeNative('track_metrica_event', {
            name: name,
            params: params
        });
    },
    trackFirebaseEvent(name, params = {}) {
        bridge.invokeNative('track_firebase_event', {
            name: name,
            params: params
        });
    },
    trackAppsFlyerEvent(name, params = {}) {
        bridge.invokeNative('track_appsflyer_event', {
            name: name,
            params: params
        });
    },
    trackCommonEvent(name, params = {}) {
        nativeStat.trackMetricaEvent(name, params);
        nativeStat.trackFirebaseEvent(name, params);
    },
    reportMetricaUserProperty(params) {
        bridge.invokeNative('report_metrica_user_property', params);
    },
    reportAppsFlyerUserProperty(params) {
        bridge.invokeNative('report_appsflyer_user_property', params);
    },
    reportFirebaseUserProperty(params) {
        bridge.invokeNative('report_firebase_user_property', params);
    }
};

export default nativeStat;
