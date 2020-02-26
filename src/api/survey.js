import api from './instance';

export function postSurveyAnswer(params) {
    return api.post('api/survey/answer', params);
}