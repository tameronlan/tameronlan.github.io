<template>
    <div class="signup">
        <div class="signup-step">
            <div>
                <signup-step-back/>
                <div class="signup-step__title">{{$t('signup.age')}}</div>
                <div class="signup-step__field">
                    <input class="signup-step__input"
                           type="number"
                           :class="{'signup-step__input_invalid': error != null}"
                           :placeholder="$t('signup.age_placeholder')"
                           :value="userAge"
                           :key="keyInput"
                           @focus="focused = true" @blur="focused = false"
                           @input="input"
                           @keyup.enter="nextStep"
                           ref="inputField">

                    <div v-if="error" class="signup-step__invalid">{{error}}</div>
                </div>
            </div>

            <div class="btn signup-step__btn ripple ripple_white"
                 :class="{'signup-step__btn_active': isBtnActive !== false}"
                 @click="nextStep"
                 v-touch
            >{{$t('done')}}</div>
        </div>
    </div>
</template>

<script>
    import SignupStepBack from '@/components/signup/SignupStepBack';
    import {mapGetters} from 'vuex';

    export default {
        name: "SignupAge",
        components: {SignupStepBack},
        data(){
            return {
                focused: false,
                error: null,
                userAge: '',
                isBtnActive: false,
                maxAge: 150,
                minAge: 18,
                keyInput: 'ageInput'
            }
        },
        computed: {
            ...mapGetters('signup', ['params'])
        },
        created(){
            if (this.params.age !== 0){
                this.userAge = this.params.age;
            }
        },
        mounted(){
            this.$refs.inputField.focus();
        },
        methods: {
            input(event){
                this.userAge = event.target.value;

                if (String(this.userAge).length >= 2){
                    this.checkAge();
                }
            },
            back(){
                this.$nav.go(-1);
            },
            nextStep(){
                if (this.checkAge()){
                    this.setAge();
                } else {
                    this.$refs.inputField.focus();
                }
            },
            checkAge(){
                let isValid = false;
                let parseAge = Math.floor(Number(this.userAge));

                if (isNaN(parseAge)){
                    this.error = this.$t('signup.error_age_wrong_format');
                } else if (parseAge < 18){
                    this.error = this.$t('signup.error_age_min_value', {'min_age': this.minAge});
                } else if (parseAge > 150){
                    this.error = this.$t('signup.error_age_max_value', {'max_age': this.maxAge});
                } else {
                    this.error = null;

                    isValid = true;
                }

                this.isBtnActive = isValid;

                return isValid;
            },
            setAge(){
                this.$store.commit('signup/setAge', this.userAge);

                this.$nav.push('/app/signup_city');
            }
        }
    }
</script>
