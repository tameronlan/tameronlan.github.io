<template>
    <div class="review-result">
        <template v-if="isCompleted">
            <div class="review-result__completed" v-html="$t('review.result.title')"></div>
            <div class="popup__close" @click="$nav.back()">
                <i class="ico ico_cross-gray"></i>
            </div>
        </template>
        <template v-else>
            <div class="review-result__head">
                <div class="review-result__title">{{positiveFeedback ? $t('review.positive.title') :
                    $t('review.negative.title')}}
                </div>
                <div>
                    <star-icon class="review-result__star"
                               v-for="n in 5"
                               :key="n"
                               :class="{'review-result__star-active': n <= rate}"
                    ></star-icon>
                </div>
            </div>
            <div class="review-result__extra">
                <template v-if="positiveFeedback">
                    <div class="review-result__sub-title" v-html="$t('review.positive.subtitle')"></div>
                    <button class="btn_primary btn_size-m btn_mw220" @click="review" v-touch>{{$t('review.action1')}}
                    </button>
                    <button class="btn_link btn_size-m btn_mw220" @click="$nav.back()">{{$t('review.action2')}}</button>
                </template>
                <template v-else>
                    <div class="review-result__sub-title">{{$t('review.negative.subtitle')}}</div>
                    <textarea-autosize class="review-result__message"
                                       :placeholder="$t('review.negative.placeholder')"
                                       rows="1"
                                       :min-height="34"
                                       :max-height="100"
                                       :value="message"
                                       @input="message = $event"
                    ></textarea-autosize>
                    <button class="btn_primary btn_size-m btn_mw220" @click="send"
                            :disabled="message.length == 0 || isSending" v-touch>
                        {{$t('review.negative.action1')}}
                    </button>
                    <button class="btn_link btn_size-m btn_mw220" @click="$nav.back()">
                        {{$t('review.negative.action2')}}
                    </button>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import StarIcon from '../../assets/svg/favorite.svg';
    import TextareaAutosize from '../../components/TextareaAutosize';

    export default {
        name: 'ReviewResult',
        components: {StarIcon, TextareaAutosize},
        props: ['rate'],
        data() {
            return {
                message: '',
                isSending: false,
                isCompleted: false
            }
        },
        computed: {
            positiveFeedback() {
                return this.rate >= 4;
            }
        },
        methods: {
            review() {
                this.isSending = true;

                this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Rate App', action: 'Go To Play Market'});
                this.$nativeStat.trackMetricaEvent('item_action', {'Rate App': 'Go To Play Market'});
                this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                    af_content_type: 'Rate App',
                    ap_action: 'Go To Play Market'
                });

                this.$nav.back().then(() => {
                    location.href = 'https://play.google.com/store/apps/details?id=com.evermatch';
                });
            },
            send() {
                this.isSending = true;
                this.isCompleted = true;
            }
        }
    }
</script>
