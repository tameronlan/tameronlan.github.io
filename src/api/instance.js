import axios from 'axios';
import Vue from 'vue';
import JSONAPIResponse from '@/lib/JSONAPIResponse';
import serialize from '@/lib/serialize';
import bridge from '../bridge';

let provider;
let token;
let vendor;
let locale;
let appVersionName;
let appVersionCode;

const api = {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$api', {
            get() {
                return api;
            }
        });
    },
    init(props) {
        let {
            apiUrl,
        } = props;

        locale = props.locale;
        token = props.token;
        vendor = props.vendor;
        appVersionName = props.appVersionName;
        appVersionCode = Number(props.appVersionCode);

        const options = {
            method: 'POST',
            baseURL: `${apiUrl}/`,
            timeout: 60000,
            params: {
            }
        };

        options.withCredentials = true;

        provider = axios.create(options);
    },
    get(method, params) {
        let str = method;

        params = {
            vendor,
            appVersionName,
            appVersionCode,
            locale,
            ...params
        };

        if (token !== undefined ){
            params.access_token = token;
        }

        if (appVersionCode !== undefined ){
            params.build = appVersionCode;
        }

        if (params) {
            if (str.indexOf('?') === -1) {
                str += '?' + serialize(params);
            } else {
                str += '&' + serialize(params);
            }
        }

        return provider.get(str).then(parseResponse).catch(catchError);
    },
    post(method, params, noParse = false) {
        params = {
            vendor,
            appVersionName,
            appVersionCode,
            locale,
            ...params
        };

        if (token !== undefined ){
            params.access_token = token;
        }

        if (appVersionCode !== undefined ){
            params.build = appVersionCode;
        }

        if (noParse) {
            return provider.post(method, params);
        }

        return provider.post(method, params).then(parseResponse).catch(catchError);
    }
};

function parseResponse(response) {
    // if (response.data) {
    //     return new JSONAPIResponse(response.data);
    // }
    //
    // if (response.result === true) {
    //     return {result: true};
    // }
    //
    // throw new Error('API: bad response');
}

function catchError(error) {
    let response = error.response;

    console.log(error);

    // if (response.data && response.data.errors) {
    //     response.data.errors.forEach(item => {
    //         if (item.code === '401') {
    //             bridge.invokeNative('update_access_token');
    //         }
    //     })
    // }
}

export default api;
