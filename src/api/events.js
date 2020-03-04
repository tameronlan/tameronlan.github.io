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
                        {
                            new: 10,
                            user: {
                                id: 1,
                                name: 'Name',
                                online: true,
                                avatars: {
                                    s2: 'https://sun9-45.userapi.com/c856520/v856520560/953a6/Z8U-GqMOI7s.jpg?ava=1'
                                }
                            },
                            lastEvent: {
                                time: 100,
                                type: 1,
                            },
                        },
                        {
                            new: 0,
                            user: {
                                id: 2,
                                name: 'Name 2',
                                online: true,
                                avatars: {
                                    s2: 'https://sun9-45.userapi.com/c856520/v856520560/953a6/Z8U-GqMOI7s.jpg?ava=1'
                                }
                            },
                            lastEvent: {
                                time: 120,
                                type: 2,
                            },
                        },
                        {
                            new: 0,
                            user: {
                                id: 2,
                                name: 'Name 2',
                                online: true,
                                avatars: {
                                    s2: 'https://sun9-45.userapi.com/c856520/v856520560/953a6/Z8U-GqMOI7s.jpg?ava=1'
                                }
                            },
                            lastEvent: {
                                time: 120,
                                type: 3,
                            },
                        },
                        {
                            new: 0,
                            user: {
                                id: 2,
                                name: 'Name 2',
                                online: true,
                                avatars: {
                                    s2: 'https://sun9-45.userapi.com/c856520/v856520560/953a6/Z8U-GqMOI7s.jpg?ava=1'
                                }
                            },
                            lastEvent: {
                                time: 120,
                                type: 4,
                            },
                        },
                        {
                            new: 0,
                            user: {
                                id: 2,
                                name: 'Name 2',
                                online: true,
                                avatars: {
                                    s2: 'https://sun9-45.userapi.com/c856520/v856520560/953a6/Z8U-GqMOI7s.jpg?ava=1'
                                }
                            },
                            lastEvent: {
                                time: 120,
                                type: 5,
                            },
                        },
                        {
                            new: 0,
                            user: {
                                id: 2,
                                name: 'Name 2',
                                online: true,
                                avatars: {
                                    s2: 'https://sun9-45.userapi.com/c856520/v856520560/953a6/Z8U-GqMOI7s.jpg?ava=1'
                                }
                            },
                            lastEvent: {
                                time: 120,
                                type: 6,
                            },
                        },
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