export default {
    namespaced: true,
    state: {
        name: '',
        gender: 'm',
        age: 0,
        cityName: '',
        cityId: ''
    },
    getters: {
        params(state){
            return {
                ...state
            }
        }
    },
    mutations: {
        setGender(state, gender = 'm'){
            state.gender = gender;
        },
        setAge(state, age = 18){
            state.age = age;
        },
        setName(state, name = ''){
            state.name = name;
        },
        setCityId(state, cityId){
            state.cityId = cityId;
        },
        setCityName(state, cityName){
            state.cityName = cityName;
        }
    },
    actions: {}
}
