<template>
    <div class="meeting-feed">
        <template v-if="!hasMainPhoto">
            <promo-photo/>
        </template>
        <template v-if="hasMainPhoto">
            <waiters/>
        </template>
        <!--<settings @filterMode="showFilter"></settings>-->
        <!--<feed-limit v-if="hasLimit" :limitData="feedLimit"/>-->
        <empty-feed v-if="isEmpty" @filterMode="showFilter"/>
        <template v-else>
            <cards
                    :cards="visibleCards"
                    @likeAction="handleLikeAction"
                    @dislikeAction="handleDislikeAction"
                    @hideCard="removeCardFromDeck"
            />
        </template>
        <transition name="fade">
            <filter-setting v-if="filterMode" @close="filterMode = false"/>
        </transition>
    </div>
</template>

<script>
    import Settings from './Settings';
    import Cards from './Cards';
    import EmptyFeed from './EmptyFeed';
    import FeedLimit from './FeedLimit';
    import PromoPhoto from './PromoPhoto';
    import {mapState, mapGetters} from 'vuex';
    import feed from '@/feed/';
    import {DIRECTION_RIGHT, DIRECTION_LEFT, PLACEMENT_FEED, AVATAR_STATUS_APPROVED} from '../../consts';
    import FilterSetting from './FilterSettings';
    import interstitials from '../../advert/interstitials';
    import Waiters from './Waiters';

    export default {
        name: 'Feed',
        components: {Settings, Cards, EmptyFeed, FeedLimit, FilterSetting, Waiters, PromoPhoto},
        data() {
            return {
                filterMode: false,
                hasMainPhoto: false
            }
        },
        computed: {
            ...mapState('feed', ['visibleCards', 'filter', 'feedLimit', 'viewedCards', 'viewedCardsAfterPhotoRequest']),
            ...mapState('vip', ['hasVip']),
            ...mapGetters('feed', ['currentCard', 'isEmpty', 'hasLimit', 'needUploadPhoto']),
        },
        created(){
            let query = this.$nav.activeIntent && this.$nav.activeIntent.query || {};

            feed.init({...{}, ...query});
        },
        methods: {
            handleLikeAction() {
                feed.likeAction(this.currentCard);
                // feed.showSwipeTutorial(DIRECTION_RIGHT, this.currentCard);
            },
            handleDislikeAction() {
                feed.dislikeAction(this.currentCard);
                // feed.showSwipeTutorial(DIRECTION_LEFT, this.currentCard);
            },
            removeCardFromDeck() {
                this.$store.commit('feed/removeCurrentCard');
            },
            showFilter() {
                this.filterMode = true;
            }
        },
        watch: {
            filter(newFilter, oldFilter) {
                if (!newFilter || !oldFilter) {
                    return;
                }

                if (newFilter.age_from !== oldFilter.age_from || newFilter.age_to !== oldFilter.age_to) {
                    feed.filterBy(newFilter);
                }
            },
            feedLimit(newLimit, oldLimit) {
                if (newLimit == null && oldLimit != null) {
                    feed.resetCards();
                }
            },
            viewedCards(count) {
                let placement = interstitials.getPlacement(PLACEMENT_FEED);

                if (this.hasVip || !placement) {
                    return;
                }

                let frequency = placement.options.interval || 10;

                if (count % frequency === 1) {
                    interstitials.load(PLACEMENT_FEED);
                } else if (count % frequency === 0) {
                    interstitials.present(PLACEMENT_FEED);
                }
            }
        }
    };
</script>

