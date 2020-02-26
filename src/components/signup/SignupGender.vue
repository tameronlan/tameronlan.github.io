<template>
    <div class="signup">
        <div class="signup-step signup-step_gender">
            <div class="signup-logo"></div>

            <carousel
                    :paginationEnabled="false"
                    :perPage="1"
                    :autoplay="true"
                    :autoplayTimeout="3000"
                    :loop="true"
            >
                <slide
                        v-for="slide in slides"
                        :class="'signup-slide'"
                        :key="slide.icon"
                >
                    <i :class="'signup-slide__ico ico ico_'+ slide.icon"></i>
                    <div class="signup-slide__text">
                        {{slide.text}}
                    </div>
                </slide>
            </carousel>

            <div class="signup-hi">
                {{$t('signup.hi')}}
            </div>

            <button class="btn ripple_white signup-btn__gender signup-btn__gender_male" v-touch @click="setGender('m')">
                {{$t('signup.choice_male')}}
            </button>

            <button class="btn ripple_white signup-btn__gender signup-btn__gender_female" v-touch @click="setGender('f')">
                {{$t('signup.choice_female')}}
            </button>

            <label class="signup-agreements checkbox__label">
                <input type="checkbox" v-model="agreementsChecked" checked="checked">
                <span class="checkbox__box">
                <span class="checkbox__mark"></span>
            </span>
                <span v-html="$t('signup.agreement_text')"></span>
            </label>
        </div>
    </div>
</template>

<script>
    import {Carousel, Slide} from "vue-carousel"
    import {mapGetters} from 'vuex';
    import alertDialog from '@/popups/alertDialog';

    export default {
        name: "SignupGender",
        components: {
            Carousel,
            Slide
        },
        computed: {
            ...mapGetters('signup', ['params'])
        },
        created(){

        },
        data() {
            return {
                agreementsChecked: true,
                slides: [
                    {
                        icon: "geo",
                        text: this.$t('signup.meet')
                    },
                    {
                        icon: "dating",
                        text: this.$t('signup.date')
                    },
                    {
                        icon: "chat",
                        text: this.$t('signup.chat')
                    },
                ]
            }
        },
        methods: {
            setGender(gender){
                if (this.agreementsChecked){
                    this.$store.commit('signup/setGender', gender);

                    this.$nav.push('/app/signup_name');
                } else {
                    alertDialog.open({
                        title: "Внимание",
                        description: "Необходимо ваше согласие"
                    });
                }
            }
        }
    }
</script>
