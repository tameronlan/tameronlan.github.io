<template>
    <div class="vip-card" :class="cardClasses" :style="{ transform: transformString }"
         ref="interactElement">
        <div class="vip-card__title" v-html="$t('card_vip.title')"></div>
        <button class="btn_primary btn_size-m" :disabled="isBuying" @click="showVipOffer" v-touch>
            {{$t('card_vip.btn')}}
        </button>
        <transition name="bounce-scale">
            <div v-if="enableClose" class="vip-card__back ignore-form" @click="draggedLeft"><i
                    class="ico ico_exit-gray"></i></div>
        </transition>

    </div>
</template>

<script>
    import interactMixin from '@/mixins/interact';
    import {SOURCE_VIP_PHOTO_FEED} from '../../consts';
    import feed from '@/feed';

    export default {
        name: 'VipCard',
        mixins: [interactMixin],
        data() {
            return {
                me: this.$store.state.config.user,
                isBuying: false,
                enableClose: false,
                interactMaxRotation: 15
            }
        },
        computed: {
            cardClasses() {
                return [
                    {'vip-card__animated': this.interactAnimating},
                    `country_${this.$store.state.config.country}`
                ]
            }
        },
        mounted() {
            this.interactLockXAxis = this.interactLockYAxis = true;

            setTimeout(() => {
                this.interactLockXAxis = this.interactLockYAxis = false;
                this.enableClose = true;
            }, 3000);

            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Photo Feed VIP Promo', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Photo Feed VIP Promo': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                af_content_type: 'Photo Feed VIP Promo',
                ap_action: 'View'
            });
        },
        methods: {
            showVipOffer() {
                feed.showVipFullOffer({source: SOURCE_VIP_PHOTO_FEED}).then((params = {}) => {
                    if (params.success) {
                        this.draggedRight();
                    }
                });
            },
            draggedRight() {
                this.playCard();
                this.interactSetPosition({
                    x: this.interactOutOfSightXCoordinate,
                    rotation: this.interactMaxRotation,
                });
                this.hideCard();
            },
            draggedLeft() {
                this.playCard();
                this.interactSetPosition({
                    x: -this.interactOutOfSightXCoordinate,
                    rotation: -this.interactMaxRotation,
                });
                this.hideCard();
            },
            playCard() {
                this.interactUnsetElement();
            },
            hideCard() {
                setTimeout(() => {
                    this.$emit('hideCard');
                }, 300);
            }
        }
    }
</script>
