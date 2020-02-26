import api from './instance';

export function addComment(params) {
    return api.post('api/usedesk/addComment', params);
}

export function getChat() {
    return api.get('api/usedesk/getChat');
}