<template>
    <div class="result-survey">
        <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
            <loader></loader>
        </div>
        <template v-else>
            <div class="result-survey__title" v-html="$t('survey_result.title')"></div>
            <div class="result-survey__content">
                <div class="result-survey__results" :class="surveyResultClasses"></div>
                <div class="result-survey__description">
                    <div class="result-survey__match" v-html="matchText"></div>
                    <div class="result-survey__based">{{$t('survey_result.based')}}</div>
                </div>
            </div>
            <div class="result-survey__offer">
                <div class="result-survey__price" v-html="price"></div>
                <div class="result-survey__methods">
                    <button v-for="item in billingMethods" class="result-survey__buy-btn btn_size-m"
                            :class="[item.has_accent ? 'btn_primary' : 'btn_secondary']"
                            :key="item.id"
                            :disabled="isBuying"
                            @click="buyOffer(item)"
                            v-touch>{{ $t(item.label) }}
                    </button>
                </div>
                <div v-if="billingMeta" class="result-survey__terms" v-html="billingMeta.terms"></div>
            </div>
            <transition name="bounce-scale">
                <div v-if="enableClose" class="popup__close" @click="$emit('close')">
                    <i class="ico ico_exit"></i>
                </div>
            </transition>
        </template>
    </div>
</template>

<script>
    import Loader from '../../components/Loader';
    import bridge from '@/bridge';
    import {buy} from '../../vip';
    import {show} from '../../api/vip';
    import {GENDER_MAN, SOURCE_VIP_MATCH_TEST} from '../../consts';

    export default {
        name: 'ResultSurvey',
        components: {Loader},
        props: ['offer', 'trialIsAvailable'],
        data() {
            return {
                me: this.$store.state.config.user,
                isBuying: false,
                isLoading: false,
                billingMethods: [],
                billingMeta: null,
                enableClose: false,
                productPrice: {}
            }
        },
        computed: {
            surveyResultClasses() {
                return [
                    {'result-survey__results_for-man': this.isMan},
                    `country_${this.$store.state.config.country}`
                ]
            },
            isMan() {
                return this.me.gender === GENDER_MAN;
            },
            price() {
                if (this.trialIsAvailable) {
                    return this.$t('survey_result.trial');
                }

                return this.$t('survey_result.price', {price: this.productPrice.price});
            },
            matchText() {
                let gender = this.isMan ? this.$t('survey_result.female') : this.$t('survey_result.male');
                return this.$t('survey_result.match', {gender: gender});
            }
        },
        created() {
            this.$nativeStat.trackFirebaseEvent('match_test_finish');
            this.$nativeStat.trackMetricaEvent('match_test_finish');
            this.$nativeStat.trackAppsFlyerEvent('ap_match_test_finish');

            this.loadBillingMethods();
        },
        mounted() {
            setTimeout(() => {
                this.enableClose = true;
            }, 600);
        },
        methods: {
            buyOffer(selectedMethod) {
                this.isBuying = true;

                this.trackBeginEvent();

                buy(selectedMethod.id, this.offer, SOURCE_VIP_MATCH_TEST).then(response => {
                    if (response.success) {
                        this.showSuccessNotify();
                        this.trackCompleteEvent();

                        this.$store.commit('vip/setVip', true);

                        this.$emit('close');
                    }
                }).catch(error => {
                    console.log('Error buyVip', error.message);
                }).finally(() => {
                    this.isBuying = false;
                });
            },
            showSuccessNotify() {
                this.$push.emit('notification', {
                    data: {
                        text: this.$t('notification.vip'),
                        ava: this.me.avatars.s1,
                        ico: 'ico ico_diamond-small',
                        style: 'yellow-gradient'
                    }
                });
            },
            loadBillingMethods() {
                this.isLoading = true;

                show({
                    source: SOURCE_VIP_MATCH_TEST,
                    billingParams: this.offer.billing_params
                }).then(response => {
                    this.billingMethods = response.objects;
                    this.billingMeta = response.meta;

                    bridge.invokeNative('get_prices', {type: 'subs', products: [this.offer.sku]}, (prices) => {
                        this.productPrice = prices[0];
                        this.isLoading = false;

                        this.trackPromoEvent();
                    });
                });
            },
            trackPromoEvent() {
                if (this.trialIsAvailable) {
                    this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'VIP Trial Promo', action: 'View'});
                    this.$nativeStat.trackMetricaEvent('item_action', {'VIP Trial Promo': 'View'});
                    this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                        af_content_type: 'VIP Trial Promo',
                        ap_action: 'View'
                    });

                    this.$nativeStat.trackCommonEvent('vip_trial_promo', {source: SOURCE_VIP_MATCH_TEST});
                } else {
                    this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'VIP Subscribe Promo', action: 'View'});
                    this.$nativeStat.trackMetricaEvent('item_action', {'VIP Subscribe Promo': 'View'});
                    this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                        af_content_type: 'VIP Subscribe Promo',
                        ap_action: 'View'
                    });

                    this.$nativeStat.trackCommonEvent('vip_subscribe_promo', {source: SOURCE_VIP_MATCH_TEST});
                }

                this.$nativeStat.trackAppsFlyerEvent('af_content_view', {
                    af_price: this.productPrice.value,
                    af_currency: this.productPrice.currency,
                    af_content_id: this.productPrice.id,
                    af_content_type: SOURCE_VIP_MATCH_TEST
                });
            },
            trackBeginEvent() {
                this.$nativeStat.trackCommonEvent('vip_subscribe_begin', {
                    source: SOURCE_VIP_MATCH_TEST,
                    subscription_id: this.offer.subscription_id,
                    VALUE: this.productPrice.value,
                    currency: this.productPrice.currency
                });

                this.$nativeStat.trackAppsFlyerEvent('af_initiated_checkout', {
                    af_price: this.productPrice.value,
                    af_currency: this.productPrice.currency,
                    af_content_id: this.productPrice.id,
                    af_content_type: SOURCE_VIP_MATCH_TEST
                });
            },
            trackCompleteEvent() {
                this.$nativeStat.trackCommonEvent('vip_subscribe_complete', {
                    source: SOURCE_VIP_MATCH_TEST,
                    subscription_id: this.offer.subscription_id,
                    VALUE: this.productPrice.value,
                    currency: this.productPrice.currency
                });

                this.$nativeStat.reportMetricaUserProperty([
                    {key: 'is_paying', boolean: true},
                    {key: 'has_vip', boolean: true}]
                );
                this.$nativeStat.reportFirebaseUserProperty([
                    {key: 'is_paying', boolean: true},
                    {key: 'has_vip', boolean: true}]
                );
                // reportAppsFlyerUserProperty - not required
            }
        }
    }
</script>
