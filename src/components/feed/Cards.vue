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
    </div>
</template>

<script>
    import Card from './Card';
    import {mapState, mapGetters} from 'vuex';
    import feed from '@/feed';
    import Loader from '@/components/common/Loader';

    export default {
        name: "Cards",
        components: {Card, Loader},
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
        },
        watch: {
            viewedCards(count) {
            }
        }
    }
</script>
