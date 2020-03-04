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
                    has_my_messages: true,
                    user: {
                        id: 1,
                        name: 'Name',
                        age: 21,
                        gender: 'f',
                        online: true,
                        avatars: {
                            s1: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13',
                            s2: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13',
                            s5: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13',
                        }
                    },
                    lastmess: {
                        time: 100,
                        text: 'sdasdkajs dhsad hjksajhdsk '
                    },
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