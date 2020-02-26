<template>
    <div class="signup">
        <div class="signup-step">
            <div>
                <signup-step-back/>
                <div class="signup-step__title">{{$t('signup.city')}}</div>
                <div class="signup-step__field">
                    <div class="signup-step__field-clear" @click="emptySearch" v-if="cityName.length > 0"></div>
                    <input class="signup-step__input"
                           type="text"
                           :placeholder="$t('signup.city_placeholder')"
                           :value="cityName"
                           @focus="focused = true" @blur="focused = false"
                           @input="search"
                           @keyup.enter="registration"
                           ref="inputField">
                </div>
            </div>

            <div class="signup-step__cities" v-if="citiesListShown">
                <div v-for="(city, index) in foundCities" class="signup-step__city" @click="setCity(city)">
                    <div class="signup-step__city-name">{{city.name}}</div>
                    <div class="signup-step__city-country">{{city.countryName}}</div>
                </div>

                <div v-if="foundCities.length === 0 && !isLoadingCities" class="signup-step__cities-empty">
                    {{$t('signup.error_city_not_found')}}
                </div>

                <div v-if="isLoadingCities" class="signup-step__loader loader-wrap loader-wrap-inside">
                    <loader :small="true"/>
                </div>
            </div>

            <div class="btn signup-step__btn ripple ripple_white"
                 v-else="citiesListShown"
                 :class="{'signup-step__btn_active': checkCityId() !== false}"
                 @click="registration"
                 v-touch
            >{{$t('done')}}</div>

            <div v-if="isLoading" class="signup-step__loader loader-wrap loader-wrap-inside">
                <loader :small="true"/>
            </div>
        </div>
    </div>
</template>

<script>
    import SignupStepBack from '@/components/signup/SignupStepBack';
    import Loader from '@/components/common/Loader';
    import {mapGetters} from 'vuex';
    import {VENDOR_IOS} from '@/consts';
    import geo from '@/lib/geo';
    import {getGeoByCoordinations, getCitiesByName, registration} from '@/api/meeting';
    import {getVendor} from '@/lib/browser';

    export default {
        name: "SignupCity",
        data(){
            return {
                isLoading: true,
                error: null,
                cityName: "",
                cityId: 0,
                countryId: 0,
                longitude: 0,
                latitude: 0,
                citiesListShown: false,
                foundCities: [],
                cacheCities: {},
                isLoadingCities: false
            }
        },
        mounted(){
            let vendor = getVendor();

            if (vendor !== VENDOR_IOS){
                this.requestPosition();
            }
        },
        components: {
            SignupStepBack,
            Loader
        },
        computed: {
            ...mapGetters('signup', ['params'])
        },
        methods: {
            requestPosition(){
                geo.getCurrentPosition(true).then(position => {
                    this.findCityByCoordinations(position.latitude, position.longitude);
                }).catch(() => {
                    this.search();
                    this.isLoading = false;
                });
            },
            search(event = null){
                if (event !== null){
                    this.cityName = event.target.value;
                }

                let searchString = this.cityName;

                searchString = searchString.trim();

                this.showListOfCities();

                if (this.cacheCities[searchString] !== undefined){
                    this.isLoadingCities = false;

                    this.foundCities = this.cacheCities[searchString];
                } else {
                    this.isLoadingCities = true;

                    getCitiesByName().then((response) => {
                        this.isLoadingCities = false;

                        this.cacheCities[searchString] = response;

                        if (searchString === this.cityName){
                            this.foundCities = response;
                        }
                    }).catch(() => {
                        this.isLoadingCities = false;
                    });
                }
            },
            findCityByCoordinations(latitude, longitude) {
                getGeoByCoordinations(latitude, longitude).then((response) => {
                    let city = response;

                    if (city) {
                        this.setCity(city);
                        this.isLoading = false;
                    } else {
                        this.search();
                        this.isLoading = false;
                    }
                }).catch(() => {
                    this.search();

                    this.isLoading = false;
                });
            },
            setCity(city){
                this.cityName = city.name;
                this.cityId = city.id;

                this.$store.commit('signup/setCityId', this.cityId);
                this.$store.commit('signup/setCityName', this.cityName);

                this.hideListOfCities();
            },
            emptySearch(){
                this.cityName = "";

                this.search();
            },
            showListOfCities(){
                this.citiesListShown = true;
            },
            hideListOfCities(){
                this.citiesListShown = false;
            },
            checkCityId(){
                return this.cityId !== 0;
            },
            registration(){
                this.isLoading = true;

                registration(this.params).then(response => {
                    this.$nav.push('/app/tutorial');
                }).catch(error => {

                });
            }
        }
    }
</script>