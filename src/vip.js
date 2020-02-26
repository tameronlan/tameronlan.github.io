import bridge from '@/bridge';
import {BILL_METHOD_ANDROID} from "./consts";

export function buy(method, offer, source) {
    return new Promise((resolve, reject) => {
        switch (method) {
            case BILL_METHOD_ANDROID:
            default:
                return nativeBuy({
                    billing_params: offer.billing_params,
                    offer: offer.sku,
                    type: 'subs',
                    source: source
                }).then(resolve).catch(reject);
        }
    });
}

function nativeBuy(params) {
    return new Promise((resolve, reject) => {
        if (bridge.isSupported()) {
            bridge.invokeNative('buy', params, (response) => {
                resolve(response);
            });
        } else {
            reject(new Error('Bridge buy not supported'));
        }
    });
}
