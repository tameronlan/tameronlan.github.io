import {getVendor} from '@/lib/browser';
import {VENDOR_IOS} from '@/consts';

const vendor = getVendor();

let methods = {};
let callbacks = {};
let uniqId = 0;

window.webviewBridgeJs = window.webViewBridgeJs = {
    invokeMethod(methodName, paramsObj) {
        if (typeof methods[methodName] == "function") {
            methods[methodName].call(this, paramsObj);
        }
    },
    callback(callbackId, paramsObj) {
        if (typeof callbacks[callbackId] == "function") {
            callbacks[callbackId].call(this, paramsObj);
            delete callbacks[callbackId];
        }
    },
    goBack() {
        history.back();
    }
};

export default {
    registerMethod: function (methodName, fn) {
        methods[methodName] = fn;
    },
    invokeNative: function (methodName, params = {}, callbackFn = null) {
        if (callbackFn) {
            callbacks[++uniqId] = callbackFn;
        }

        if (vendor === VENDOR_IOS) {
            const touple = {
                name: methodName,
                params
            };

            if (callbackFn) {
                touple.callback_id = uniqId + "";
            }

            window.webkit.messageHandlers.bridge.postMessage(JSON.stringify({
                invoke_method: touple
            }));
        } else if (window.webviewBridgeNative && typeof window.webviewBridgeNative.invokeMethod == "function") {
            window.webviewBridgeNative.invokeMethod(
                methodName,
                JSON.stringify(params),
                callbackFn ? uniqId : 0
            );
        }
    },
    isSupported: function () {
        return (vendor === VENDOR_IOS) || !!window.webviewBridgeNative;
    }
}

if (true || process.env.NODE_ENV === 'development') {
    let callJsMethod = (methodName, params, uniqId) => {
        switch (methodName) {
            case 'get_api_host':
                window.webviewBridgeJs.callback(uniqId, {
                    //api_url: 'https://st-serious.vs58.net/'
                    // api_url: 'http://10.110.19.59:8080/'
                    api_url: 'https://cloud.sweetmeet.me/oapi/method/'

                    //api_url: 'http://localhost:8080/'
                });
                break;
            case 'get_prices':
                window.webviewBridgeJs.callback(uniqId, [
                    {id: params.products[0], price: '$1.49', value: 1.49, currency: '$'}
                ]);
                break;
            case 'buy':
                window.webviewBridgeJs.callback(uniqId, {success: true});
                break;
            case 'get_location':
                window.webviewBridgeJs.callback(uniqId, {
                    coordinates: {
                        lat: 59.956428800000005,
                        lon: 30.3439872
                    }
                });
                break;
            case 'get_location_permission':
                window.webviewBridgeJs.callback(uniqId, {
                    permission: 'unknown'
                    //permission: 'granted'
                });
                break;
        }
    }

    window.webviewBridgeNative = {
        invokeMethod: function (methodName, params, uniqId) {
            console.log('invokeMethod', methodName, params, uniqId);
            params = JSON.parse(params);

            callJsMethod(methodName, params, uniqId);
        }
    };

    if (vendor === VENDOR_IOS) {
        window.webkit = {
            messageHandlers: {
                bridge: {
                    postMessage: (jsonData) => {
                        let data = JSON.parse(jsonData);
                        console.log('messageHandlers.bridge', data);
                        let invoke_method = data.invoke_method;
                        if (invoke_method) {
                            callJsMethod(invoke_method.name, invoke_method.params, invoke_method.callback_id);
                        }
                    }
                }
            }
        }
    }
}
