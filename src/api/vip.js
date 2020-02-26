import api from './instance';

export function show(params) {
    return api.post('api/vip/show', params);
}