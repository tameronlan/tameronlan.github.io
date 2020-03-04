import api from './instance';
import store from '@/store/';

export function getPairs(params) {
    return api.get('api/events/getPairs', params).then(parseResponse);
}

export function getIncoming(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve({
                status: 1,
                data: {
                    list:[

                    ]
                }
            })
        }, 200);
    });

    // return api.get('api/events/getIncoming', params).then(parseResponse);
}

export function read(id) {
    return api.post('api/events/read', {
        userId: id
    }).then(parseResponse);
}

export function hide(id) {
    return api.post('api/events/hide', {
        userId: id
    }).then(parseResponse);
}

export function parseResponse(response) {
    if (response.meta) {
        if (response.meta.counters) {
            store.commit('feed/setCounters', response.meta.counters);
        }
    }

    return response;
}