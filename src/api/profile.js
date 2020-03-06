import api from './instance';
import store from '@/store/';

export function getProfile() {
    return api.get('api/profile/getProfile');
}

export function getInfo() {
    return api.get('api/profile/getInfo');
}

export function getMyInfo(params) {
    let fields = `country,city,age,about_me,avatar,vip_end,gender,birthday,email_approved,complainted,avatar_status,is_hidden,meeting_last_visit,register_time,is_banned,ban_till_time,meeting_first_visit,payable,can_change_age_gender,offers_enabled,video_enabled,ig_user_id,ig_username,vip_trial_ttl,preferences,coins,coins_daily,coins_daily_progress_current,coins_daily_progress_maximum,wanna_talk,actions,cardExtension,audioGreeting,audioVisualization`;

    params = {...params, fields};

    
    return api.get('user.getMyInfo', params);
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
    return response;
}
