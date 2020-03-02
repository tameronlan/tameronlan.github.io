<template>
    <div class="vip-popup extend">
        <div class="vip-popup__back" @click="closeOffer">
            <i class="ico ico_arrow-left-white-24"></i>
        </div>
        <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
            <loader></loader>
        </div>
        <template v-else>
            <template v-if="step === 'profit'">
                <div class="vip-popup-profit">
                    <div class="vip-popup-user">
                        <div class="vip-popup-user__ava"></div>
                        <div class="ico ico_crown-w80"></div>
                    </div>
                    <div class="vip-popup__title" v-html="$t('vip_offer.title')"></div>
                    <ol class="vip-popup-profit__list">
                        <li class="vip-popup-profit__item" v-html="$t('vip_offer.profit[0]')"></li>
                        <li class="vip-popup-profit__item" v-html="$t('vip_offer.profit[1]')"></li>
                        <li class="vip-popup-profit__item" v-html="$t('vip_offer.profit[2]')"></li>
                        <li class="vip-popup-profit__item" v-html="$t('vip_offer.profit[3]')"></li>
                        <li class="vip-popup-profit__item" v-html="$t('vip_offer.profit[4]')"></li>
                    </ol>
                </div>
                <div class="btn btn_orange vip-popup__btn vip-popup__btn_profit ripple ripple_white" v-touch @click="step = 'prices'">
                    Получить преимущества
                </div>
            </template>
            <template v-else-if="step==='prices'">
                <div class="vip-popup-prices">
                    <div class="vip-popup-user">
                        <div class="vip-popup-user__ava"></div>
                        <div class="ico ico_crown"></div>
                    </div>

                    <div class="vip-popup__title" v-html="$t('vip_offer.title')"></div>

                    <div class="vip-popup-prices-list" ref="listContainer" key="listContainer">
                        <div
                                class="vip-popup-prices-item"
                                v-for="(product, index) in products"
                                :class="{'vip-popup-prices-item_active': product.isActive}"
                                @click="choiceProduct(product)"
                        >
                            <div v-if="product.isPopular" class="vip-popup-prices-item__label">Popular</div>
                            <div class="vip-popup-prices-item__period" v-html="product.period"></div>
                            <div class="ico ico_crown" :class="`vip-popup-prices-item__ico_${index}`"></div>
                            <div class="vip-popup-prices-item__price">{{product.price}}</div>
                            <div class="vip-popup-prices-item__ok">
                                <div class="ico2 ico2_ok-white"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn btn_orange vip-popup__btn ripple ripple_white" v-touch>
                    Получить VIP-статус
                </div>
            </template>
        </template>
    </div>
</template>

<script>
    import Loader from '@/components/common/Loader';
    import timerSystem from '@/lib/timerSystem';
    import bridge from '@/bridge';
    import {buy} from '@/vip';
    import {show} from '@/api/vip';
    import {mapState} from 'vuex';

    export default {
        name: "VipFullOffer",
        components: {Loader},
        props: ['source'],
        data() {
            return {
                me: this.$store.state.currentUser,
                isBuying: false,
                isLoading: false,
                billingMethods: [],
                billingMeta: null,
                offer: null,
                confirmShown: false,
                discountEndTimestamp: 0,
                productPrice: {},
                step: 'profit',
                products: [
                    {
                        id: 1,
                        period: '<b>1</b><br/>week',
                        price: '100 rub',
                        isPopular: true,
                        isActive: true
                    },
                    {
                        id: 2,
                        period: '<b>1</b><br/>month',
                        price: '700 rub',
                        isPopular: false,
                        isActive: false
                    },
                    {
                        id: 3,
                        period: '<b>6</b><br/>month',
                        price: '1000 rub',
                        isPopular: false,
                        isActive: false
                    }
                ]
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

                return this.$t('vip_offer.price', {
                    period: periodValue,
                    price: this.productPrice.price
                });
            },
            ...mapState('vip', ['purchaseOffer', 'trial'])
        },
        created() {
            this.offer = {};

            this.loadBillingMethods();
        },
        beforeDestroy() {
            this.stopTimer();
        },
        methods: {
            loadBillingMethods() {
                this.isLoading = false;

                // show({
                //     source: this.source,
                //     billingParams: this.offer.billing_params
                // }).then(response => {
                //     bridge.invokeNative('get_prices', {type: 'subs', products: [this.offer.sku]}, (prices) => {
                //         this.productPrice = prices[0];
                //         this.isLoading = false;
                //     });
                // });
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
                if (this.step === 'prices') {
                    this.step = 'profit';
                } else {
                    this.$nav.back({success: false});
                }
            },
            choiceProduct(product){
                this.$refs.listContainer.style.height = this.$refs.listContainer.offsetHeight + 'px'
                this.products.forEach(item => {
                    item.isActive = item.id === product.id
                });
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
