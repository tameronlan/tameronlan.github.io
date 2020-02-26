<template>
    <div class="vip-full-offer extend">
        <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
            <loader></loader>
        </div>
        <template v-else>
            <div class="vip-full-offer__title" v-html="$t('vip_offer.title')"></div>
            <ol class="vip-full-offer__profit">
                <li class="vip-full-offer__profit-item">{{$t('vip_offer.profit[0]')}}</li>
                <li class="vip-full-offer__profit-item">{{$t('vip_offer.profit[1]')}}</li>
                <li class="vip-full-offer__profit-item">{{$t('vip_offer.profit[2]')}}</li>
            </ol>
            <div class="vip-full-offer__extra">
                <template v-if="isOneTimeOffer">
                    <div class="vip-full-offer__discount">
                        <div class="vip-full-offer__discount-message"
                             v-html="$t('vip_offer.discount', {count: offer.discount_percent})"></div>
                        <div v-if="isIOS" class="vip-full-offer__discount-sub-message"
                             v-html="$t('vip_offer.discount_ios_price', {price: this.productPrice.price, old_price: this.productPrice.value * 2})"></div>
                        <div class="vip-full-offer__discount-countdown">{{this.discountCountdown}}</div>
                    </div>
                    <div v-if="!isIOS" class="vip-full-offer__price" v-html="priceMessage"></div>
                </template>
                <div v-else-if="trialIsAvailable" class="vip-full-offer__trial">
                    <div class="vip-full-offer__trial-message"
                         v-html="$t('vip_offer.trial', {count: offer.trial_days})"></div>
                    <div v-if="isIOS" class="vip-full-offer__trial-sub-message"
                         v-html="$t('vip_offer.trial_price', {price: productPrice.price})"></div>
                </div>
                <div v-else class="vip-full-offer__price" v-html="priceMessage"></div>
                <div class="vip-full-offer__extra-content">
                    <div class="vip-full-offer__methods">
                        <button v-for="item in billingMethods" class="vip-full-offer__buy-btn btn_size-m"
                                :class="[item.has_accent ? 'btn_primary' : 'btn_secondary']"
                                :key="item.id"
                                :disabled="isBuying"
                                @click="buyOffer(item)"
                                v-touch>{{ $t(item.label) }}
                        </button>
                        <button v-if="isIOS" class="vip-full-offer__buy-btn btn_link btn_size-m"
                                :disabled="isBuying"
                                @click="restorePurchases">
                            {{this.$t('vip_offer.restore')}}
                        </button>
                    </div>
                    <div v-if="billingMeta.terms" class="vip-full-offer__terms" v-html="billingMeta.terms"></div>
                </div>
            </div>
            <div class="vip-full-offer__back" @click="closeOffer">
                <i class="ico ico_exit-gray"></i>
            </div>
        </template>
    </div>
</template>

<script>
    import Loader from '@/components/common/Loader';
    import serverTime from '@/lib/serverTime';
    import timerSystem from '@/lib/timerSystem';
    import bridge from '@/bridge';
    import {buy} from '@/vip';
    import {show} from '@/api/vip';
    import {mapState} from 'vuex';
    import {getVendor} from '../../lib/browser';
    import {VENDOR_IOS} from '../../consts';

    export default {
        name: "VipFullOffer",
        components: {Loader},
        props: ['source'],
        data() {
            return {
                me: this.$store.state.config.user,
                isBuying: false,
                isLoading: false,
                billingMethods: [],
                billingMeta: null,
                offer: null,
                confirmShown: false,
                discountEndTimestamp: 0,
                discountCountdown: 0,
                productPrice: {}
            }
        },
        computed: {
            trialIsAvailable() {
                return this.vip.trial != null;
            },
            isOneTimeOffer() {
                return this.offer.is_one_time_offer;
            },
            priceMessage() {
                let periodValue = parseInt(this.offer.period_value);

                if (this.offer.discount_percent > 0) {
                    return this.$t('vip_offer.discount_price', {
                        period: periodValue,
                        price: this.productPrice.price,
                        old_price: this.productPrice.value * 2
                    });
                }

                return this.$t('vip_offer.price', {
                    period: periodValue,
                    price: this.productPrice.price
                });
            },
            isIOS() {
                return getVendor() === VENDOR_IOS;
            },
            ...mapState('vip', ['purchaseOffer', 'trial'])
        },
        created() {
            let discountOffer = this.purchaseOffer && this.purchaseOffer.is_one_time_offer ? this.purchaseOffer : null;
            this.vip = {trial: this.trial, purchase: this.purchaseOffer};
            this.offer = discountOffer || this.vip.trial || this.vip.purchase;

            this.loadBillingMethods();
        },
        beforeDestroy() {
            this.stopTimer();
        },
        methods: {
            loadBillingMethods() {
                this.isLoading = true;

                show({
                    source: this.source,
                    billingParams: this.offer.billing_params
                }).then(response => {
                    this.billingMethods = response.objects;
                    this.billingMeta = response.meta;

                    if (this.isOneTimeOffer) {
                        this.discountEndTimestamp = serverTime.getActualTime() + 60;
                        this.startTimer();
                    }

                    if (response.meta.next_offer) {
                        this.$store.commit('vip/setPurchaseOffer', response.meta.next_offer.purchase);
                        this.$store.commit('vip/setTrial', response.meta.next_offer.trial);
                    }

                    bridge.invokeNative('get_prices', {type: 'subs', products: [this.offer.sku]}, (prices) => {
                        this.productPrice = prices[0];
                        this.isLoading = false;
                    });
                });
            },
            buyOffer(selectedMethod) {
                this.isBuying = true;

                buy(selectedMethod.id, this.offer, this.source).then(response => {
                    if (response.success) {
                        this.showSuccessNotify();

                        this.$store.commit('vip/setVip', true);
                        this.$nav.back({success: true});
                    }
                }).catch(error => {
                    console.log('Error buyVip', error.message);
                }).finally(() => {
                    this.isBuying = false;
                });
            },
            restorePurchases() {
                bridge.invokeNative('restore_purchases');
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
            closeOffer() {
                if (this.isOneTimeOffer) {
                    this.confirmShown = true;
                } else {
                    this.$nav.back({success: false});
                }
            },
            startTimer() {
                timerSystem.addCallback(this.updateCountdown);
            },
            stopTimer() {
                timerSystem.removeCallback(this.updateCountdown);
            },
            updateCountdown(currentTime) {
                let diff = Math.max(0, this.discountEndTimestamp - currentTime);
                let min = Math.floor(diff / 60);
                let sec = diff % 60;

                this.discountCountdown = `${('0' + min).slice(-2)}:${('0' + sec).slice(-2)}`;

                if (diff <= 0) {
                    this.stopTimer();
                }
            },
        }
    }
</script>
