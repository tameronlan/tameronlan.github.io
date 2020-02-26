<template>
    <div class="signup">
        <div class="signup-step">
            <div>
                <signup-step-back/>

                <div class="signup-step__title">{{$t('signup.name')}}</div>

                <div class="signup-step__field">
                    <input class="signup-step__input"
                           type="text"
                           maxlength="255"
                           :class="{'signup-step__input_invalid': error != null}"
                           :placeholder="$t('signup.name_placeholder')"
                           :value="userName"
                           @focus="focused = true" @blur="focused = false"
                           @input="input"
                           @keyup.enter="nextStep"
                           ref="inputField">
                    <div v-if="error" class="signup-step__invalid">{{error}}</div>
                </div>
            </div>

            <button v-touch class="btn signup-step__btn ripple ripple_white" :class="{'signup-step__btn_active': isBtnActive !== false}" @click="nextStep">{{$t('done')}}</button>
        </div>
    </div>
</template>

<script>
    import SignupStepBack from '@/components/signup/SignupStepBack';
    import {mapGetters, mapState} from 'vuex';

    export default {
        name: "SignupName",
        components: {SignupStepBack},
        data(){
            return {
                focused: false,
                error: null,
                userName: '',
                isBtnActive: false
            }
        },
        computed: {
            ...mapGetters('signup', ['params'])
        },
        created(){
            this.userName = this.params.name;
        },
        mounted(){
            this.$refs.inputField.focus();
        },
        methods: {
            input(event){
                this.userName = event.target.value;

                this.checkName();
            },
            back(){
                this.$nav.go(-1);
            },
            nextStep(){
                if (this.checkName()){
                    this.setName();
                } else {
                    this.$refs.inputField.focus();
                }
            },
            checkName(){
                let isValid = false;

                if(this.userName.length > 0){
                    this.isBtnActive = true;
                    this.error = null;

                    isValid = true;
                } else {
                    this.isBtnActive = false;
                    this.error = this.$t('signup.error_name_min_length');
                }

                return isValid;
            },
            setName(){
                this.$store.commit('signup/setName', this.userName);

                this.$nav.push('/app/signup_age');
            }
        }
    }
</script>
