import api from './instance';
import store from '@/store/';

export function getProfile() {
    return api.get('api/profile/getProfile');
}

export function getInfo() {
    return api.get('api/profile/getInfo');
}

export function saveField(params) {
    return api.get('api/profile/saveField', params);
}

export function photoUpload(params) {
    return api.post('api/profile/photoUpload', params).then(parseResponse);
}

export function photoDelete(params) {
    return api.get('api/profile/photoDelete', params).then(parseResponse);
}

export function setAvatar(params) {
    return api.get('api/profile/setAvatar', params).then(parseResponse);
}

export function parseResponse(response) {
    if (response.meta) {
        if (response.meta.avatar_status !== undefined) {
            store.commit('feed/setModerationStatus', response.meta.avatar_status);
        }

        if (response.meta.avatars !== undefined) {
            store.commit('updateUserAvatar', response.meta.avatars);
        }
    }

    return response;
}