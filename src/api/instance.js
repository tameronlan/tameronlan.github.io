import axios from 'axios';
import Vue from 'vue';
import JSONAPIResponse from '@/lib/JSONAPIResponse';
import serialize from '@/lib/serialize';
import bridge from '../bridge';

let provider;

const api = {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$api', {
            get() {
                return api;
            }
        });
    },
    init({api_url}) {
        const options = {
            method: 'POST',
            baseURL: `${api_url}/`,
            timeout: 60000,
            params: {}
        };

        options.withCredentials = true;

        provider = axios.create(options);
    },
    get(method, params) {
        let str = method;

        if (params) {
            if (str.indexOf('?') === -1) {
                str += '?' + serialize(params);
            } else {
                str += '&' + serialize(params);
            }
        }

        return provider.get(str).then(parseResponse).catch(catchError);
    },
    post(method, data, noParse = false) {
        if (noParse) {
            return provider.post(method, data);
        }
        return provider.post(method, data).then(parseResponse).catch(catchError);
    }
};

function parseResponse(response) {
    if (response.data) {
        return new JSONAPIResponse(response.data);
    }

    if (response.result === true) {
        return {result: true};
    }

    throw new Error('API: bad response');
}

function catchError(error) {
    let response = error.response;

    if (response.data && response.data.errors) {
        response.data.errors.forEach(item => {
            if (item.code === '401') {
                bridge.invokeNative('update_access_token');
            }
        })
    }
}

export default api;
