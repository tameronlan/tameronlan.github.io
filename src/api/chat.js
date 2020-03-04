import api from './instance';
import store from '@/store/';

export function getContacts(params) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                status: 1,
                data: {
                    list: [
                        {
                            new: 10,
                            user: {
                                id: 1,
                                name: 'Name',
                                online: true,
                                avatars: {
                                    s2: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13'
                                }
                            },
                            lastmess: {
                                time: 100,
                                text: 'sdasdkajs dhsad hjksajhdsk '
                            },
                        },
                        {
                            user: {
                                id: 2,
                                name: 'Name 2',
                                online: true,
                                avatars: {
                                    s2: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13'
                                }
                            },
                            lastmess: {
                                attaches: [
                                    {type: 'image'}
                                ],
                                time: 100,
                                text: 'ksdhasjkd jdhadk jahd kjsahdajs dhasdkh sdasdkajs dhsad hjksajhdsk '
                            },
                        },
                        {
                            user: {
                                id: 3,
                                name: 'Name 3',
                                online: false,
                                avatars: {
                                    s2: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                }
                            },
                            lastmess: {
                                fromId: 111,
                                time: 100,
                                text: 'hi'
                            },
                        },
                        {
                            new: 3,
                            user: {
                                id: 3,
                                name: 'Name 3',
                                online: false,
                                avatars: {
                                    s2: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                }
                            },
                            lastmess: {
                                fromId: 111,
                                time: 100,
                                text: 'hi'
                            },
                        }
                    ]
                }
            })
        }, 200);
    });

    // return api.get('api/chat/getContacts', params).then(parseResponse);
}

export function getContact(params) {
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

    // return api.get('api/chat/getContact', params).then(parseResponse);
}

export function getMessages(params) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve({
                status: 1,
                meta: {
                    has_next: false
                },
                data: {
                    messages: [
                        {
                            author_id: 112,
                            id: 11,
                            text: 'sadsadsa dajkdh',
                            time: 12111
                        },
                        {
                            author_id: 112,
                            id: 12,
                            text: 'sadsadsa dajkdh',
                            time: 12111
                        },
                        {
                            author_id: 111,
                            id: 13,
                            text: 'sadsadsa dajkdh',
                            time: 12111
                        },
                        {
                            author_id: 111,
                            id: 112,
                            text: 'sadsadsa dajkdh',
                            time: 121111
                        },
                        {
                            author_id: 111,
                            id: 113,
                            text: 'sadsadsa dajkdh',
                            time: 12111,
                            attaches: [
                                {
                                    type: 'photo',
                                    url_min: "//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13",
                                    url_orig: "//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13"
                                }
                            ]
                        },
                        {
                            author_id: 112,
                            id: 115,
                            text: 'gift',
                            time: 12111,
                            attaches: [
                                {
                                    type: 'gift',
                                    url_min: "https://st.fotocdn.net/images/gifts/146/14611/150.png",
                                    url_orig: "https://st.fotocdn.net/images/gifts/146/14611/150.png",
                                }
                            ]
                        },
                        {
                            author_id: 111,
                            id: 114,
                            text: 'sadsadsa dajkdh',
                            time: 1211111
                        },
                    ]
                }
            })
        }, 200);
    });

    // return api.get('api/chat/getMessages', params).then(parseResponse);
}

export function postMessage(params) {
    return api.post('api/chat/postMessage', params).then(parseResponse);
}

export function readAll(params) {
    return api.post('api/chat/readAll', params).then(parseResponse);
}

export function parseResponse(response) {
    if (response.meta) {
        if (response.meta.counters) {
            store.commit('feed/setCounters', response.meta.counters);
        }

        if (response.meta.daily_open_limit !== undefined) {
            store.commit('feed/setDailyOpenLimit', response.meta.daily_open_limit);
        }
    }

    return response;
}
