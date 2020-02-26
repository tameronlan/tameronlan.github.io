<template>
    <div class="promo-survey" :class="countryClass">
        <div class="promo-survey__title">{{title}}</div>
        <div class="promo-survey__subtitle">{{subtitle}}</div>
        <button class="promo-survey__start-btn btn_primary btn_size-m" @click="start" v-touch>
            {{$t('survey_promo.btn')}}
        </button>
    </div>
</template>

<script>
    import {GENDER_MAN} from '../../consts';

    export default {
        name: 'PromoSurvey',
        computed: {
            countryClass() {
                return `country_${this.$store.state.config.country}`;
            },
            title() {
                let partner = this.$t(this.isMan ? 'survey_promo.title_female' : 'survey_promo.title_male');
                return this.$t('survey_promo.title', {partner: partner});
            },
            subtitle() {
                let partner = this.$t(this.isMan ? 'survey_promo.subtitle_female' : 'survey_promo.subtitle_male');
                return this.$t('survey_promo.subtitle', {partner: partner});
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            }
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Match Test Promo', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Match Test Promo': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {af_content_type: 'Match Test Promo', ap_action: 'View'});
        },
        methods: {
            start() {
                this.$nativeStat.trackFirebaseEvent('match_test_start');
                this.$nativeStat.trackMetricaEvent('match_test_start');
                this.$nativeStat.trackAppsFlyerEvent('ap_match_test_start');

                this.$emit('close');
            }
        }
    }
</script>
