<template>
    <div class="cards">
        <div v-if="isCardsLoading" class="loader-wrap loader-wrap-inside">
            <loader/>
        </div>
        <div class="cards__list">
            <card
                    v-for="(card, index) in cards"
                    :card="card"
                    :is-current="index === 0"
                    :key="card.id"
                    @likeAction="$emit('likeAction')"
                    @dislikeAction="$emit('dislikeAction')"
                    @hideCard="$emit('hideCard')"
                    @clickProfile="handleClickProfile"
            />
        </div>
        <transition name="fade-opacity">
            <vip-card v-if="visibleVipPromo" @hideCard="hiderVipCard"/>
        </transition>
    </div>
</template>

<script>
    import Card from './Card';
    import VipCard from './VipCard';
    import {mapState, mapGetters} from 'vuex';
    import feed from '@/feed';
    import Loader from '@/components/Loader';

    const VIP_PROMO_CARD = 13;

    export default {
        name: "Cards",
        components: {Card, VipCard, Loader},
        props: ['cards'],
        data() {
            return {
                visibleVipPromo: false
            }
        },
        computed: {
            isCardsLoading() {
                return this.isLoading && this.cards.length === 0;
            },
            ...mapState('vip', ['hasVip']),
            ...mapState('feed', ['isLoading', 'viewedCards']),
            ...mapGetters('feed', ['currentCard'])
        },
        methods: {
            handleClickProfile() {
                feed.openProfile({card: this.currentCard});
            },
            hiderVipCard() {
                this.visibleVipPromo = false;
            }
        },
        watch: {
            viewedCards(count) {
                if (count === VIP_PROMO_CARD && !this.hasVip) {
                    // this.visibleVipPromo = true;
                }
            }
        }
    }
</script>
