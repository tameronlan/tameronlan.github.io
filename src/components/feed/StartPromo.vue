<template>
    <div class="start-promo extend">
        <div class="start-promo__title" v-html="$t('start_promo.title')"></div>
        <div class="start-promo__photo-wrap" :class="countryClass"></div>
        <div class="start-promo__counter" v-html="countMessage"></div>
        <div class="start-promo__message">{{$t('start_promo.message')}}</div>
        <button class="start-promo__button btn_size-m" @click="$nav.back()" v-touch>{{$t('start_promo.button')}}
        </button>
    </div>
</template>

<script>
    export default {
        name: 'StartPromo',
        props: ['promo'],
        computed: {
            countryClass() {
                return `country_${this.$store.state.config.country}`;
            },
            countMessage() {
                let availableCountries = ["ru", "br", "tr", "id", "fr", "in", "us", "de", "gb", "ca"];
                let countryCode = this.$store.state.config.country;
                let country = availableCountries.lastIndexOf(countryCode) >= 0 ? this.$t(`start_promo.countries.${countryCode}`) : '';

                return this.$t('start_promo.counter', {number: this.promo.installs_so_far, country: country});
            }
        }
    }
</script>