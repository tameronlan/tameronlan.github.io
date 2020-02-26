import api from './instance';
import store from '@/store/';

export function getConfig(params) {
    // return api.post('meeting.getConfig', {
    //     ...params,
    //     build: 361,
    //     deviceId: '7f08bb6c4699fd67:1580387688841',
    //     v: 1,
    //     vendor: 2,
    //     locale: "ru-RU"
    // });

    return {};
}

export function getFeed(params) {
    let users = [];
    let randId = Math.floor(Math.random()*1000);

    for(let i = 0; i < 10; i++){
        users.push({
            name: "user random " + (randId + i),
            id: randId + i,
            gender: Math.random() > 0.5 ? 'm' : 'f',
            age: randId,
            is_online: true,
            avatars: {
                s5: 'https://sun9-10.userapi.com/c851320/v851320058/1386fd/Zrp4BcCGR8U.jpg'
            }
        })
    }

    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve({
                users,
                hasNext: true
            })
        }, 200)
    });

    // return api.get('api/feed/getFeed', params).then(parseResponse);
}

export function getUser(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve({
                status: '',
                data: {
                    user: {
                        id: 112,
                        name: 'sadasda',
                        gender: 'f',
                        avatars: {
                            s1: '',
                            s2: '',
                            s3: '',
                            s4: '',
                        },
                        photos: []
                    }
                }
            })
        }, 200)
    });

    // return api.get('api/feed/getUser', params).then(parseResponse);
}

export function feedClick(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve({})
        }, 200)
    });

    // return api.post('/api/feed/click', params).then(parseResponse);
}

export function filterSet(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve({})
        }, 200)
    });

    // return api.get('/api/feed/filterSet', params);
}

export function complaint(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve({})
        }, 200)
    });

    // return api.get('api/feed/complaint', params);
}

export function getGeoByCoordinations(latitude, longitude) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve({
                    name: 'City Name finded by geo',
                    id: 1
                })
        }, 200)
    });

    // return api.get('api/getGeoByCoords', {latitude, longitude});
}

export function getCitiesByName(params = {}) {
    // return api.get('api/getCitiesByName', params);

    let cities = [];
    let cityId = Math.floor(Math.random() * 100);
    let countryId = Math.floor(Math.random() * 100);

    for(let i = 0; i < 20; i++){
        cities.push({
            name: "City random " + (cityId + i),
            id: cityId + i,
            countryName: "Country random " + (countryId + i),
            countryId: countryId + i
        })
    }

    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve(cities)
        }, 1000)
    });
}

export function registration(params = {}) {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            resolve()
        }, 1000)
    });
}

export function postReviewResul(params = {}) {
    return api.post('api/postReviewResult', params)
}

export function parseResponse(response) {
    if (response.meta) {
        if (response.meta.counters) {
            store.commit('feed/setCounters', response.meta.counters);
        }

        if (response.meta.filters) {
            store.commit('feed/setFilter', response.meta.filters);
        }

        if (response.meta.avatar_status !== undefined) {
            store.commit('feed/setModerationStatus', response.meta.avatar_status);
        }

        if (response.meta.daily_open_limit !== undefined) {
            store.commit('feed/setDailyOpenLimit', response.meta.daily_open_limit);
        }

        if (response.meta.has_vip !== undefined) {
            store.commit('vip/setVip', response.meta.has_vip);
        }
    }

    return response;
}
