<template>
    <div class="review">
        <div class="review__title" v-html="title"></div>
        <div class="review__stars">
            <star-icon class="review__star"
                       v-for="n in 5"
                       :key="n"
                       :class="{'review__star-active': n <= rate}"
                       @click="rate = n"
                       @click.native="rate = n"
            ></star-icon>
        </div>
        <button class="btn_primary btn_size-m btn_mw220" :disabled="rate == 0" @click="review" v-touch>
            {{$t('review.action1')}}
        </button>
        <button class="btn_link btn_size-m btn_mw220" @click="later">{{$t('review.action2')}}</button>
    </div>
</template>

<script>
    import StarIcon from '../../assets/svg/favorite.svg';
    import feed from '../../feed';
    import {postReviewResul} from '../../api/meeting';

    export default {
        name: 'Review',
        components: {StarIcon},
        data() {
            return {
                me: this.$store.state.config.user,
                rate: 0
            }
        },
        computed: {
            title() {
                return this.$t('review.title', {name: this.me.name});
            }
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Rate App', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Rate App': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {af_content_type: 'Rate App', ap_action: 'View'});
        },
        methods: {
            review() {
                postReviewResul({score: this.rate});

                this.$nav.back().then(() => {
                    feed.showReviewResult({
                        rate: this.rate
                    });
                });
            },
            later() {
                postReviewResul({postpone: true});

                this.$nav.back();
            }
        }
    }
</script>
