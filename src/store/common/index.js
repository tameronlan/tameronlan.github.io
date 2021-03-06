export default {
    namespaced: true,
    state: {
        apiUrl: "",
        token: "",
        deviceId: "",
        assistId: "",
        supportId: "",
        appVersionCode: "",
        appVersionName: "",
        locale: "",
        vendor: "",
        wsChatUrl: ""
    },
    getters: {
        config(state) {
            return {
                apiUrl: state.apiUrl,
                token: state.token,
                deviceId: state.deviceId,
                assistId: state.assistId,
                supportId: state.supportId,
                appVersionCode: state.appVersionCode,
                appVersionName: state.appVersionName,
                locale: state.locale,
                vendor: state.vendor,
                wsChatUrl: state.wsChatUrl
            };
        }
    },
    mutations: {
        setApiUrl: (state, apiUrl) => {
            state.apiUrl = apiUrl;
        },
        setToken: (state, token) => {
            state.token = token;
        },
        setAssistId: (state, assistId) => {
            state.assistId = assistId;
        },
        setSupportId: (state, supportId) => {
            state.supportId = supportId;
        },
        setAppVersionCode: (state, appVersionCode) => {
            state.appVersionCode = appVersionCode;
        },
        setAppVersionName: (state, appVersionName) => {
            state.appVersionCode = appVersionName;
        },
        setLocale: (state, locale) => {
            state.locale = locale;
        },
        setDeviceId: (state, deviceId) => {
            state.deviceId = deviceId;
        },
        setVendor: (state, vendor) => {
            state.vendor = vendor;
        },
        setWSChatUrl: (state, wsChatUrl) => {
            state.wsChatUrl = wsChatUrl;
        }
    },
    actions: {
        setConfig: ({commit}, payload = {}) => {
            commit('setApiUrl', payload.apiUrl);
            commit('setToken', payload.token);
            commit('setAssistId', payload.assistId);
            commit('setSupportId', payload.supportId);
            commit('setAppVersionName', payload.appVersionName);
            commit('setAppVersionCode', payload.appVersionCode);
            commit('setLocale', payload.locale);
            commit('setVendor', payload.vendor);
            commit('setDeviceId', payload.deviceId);
            commit('setWSChatUrl', payload.wsChatUrl);
        }
    }
}
