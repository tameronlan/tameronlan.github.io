<template>
    <div class="message-limit extend">
        <div class="message-limit__photo" :style="{backgroundImage: `url(${photoUrl})`}"></div>
        <div class="message-limit__wrap">
            <div class="message-limit__info">{{information}}</div>
            <div class="message-limit__title">{{$t('message_limit.title')}}</div>
        </div>
        <button class="btn_primary btn_size-m" :disabled="isBuying" @click="showVipOffer" v-touch>
            {{trialIsAvailable ? $t('message_limit.action_activate') : $t('message_limit.action_become')}}
        </button>
        <div class="message-limit__back" @click="$nav.back()"><i class="ico ico_exit"></i></div>
    </div>
</template>

<script>
    import {GENDER_MAN, SOURCE_VIP_CHAT_REQUEST_LIMIT} from '../../consts';
    import {mapGetters} from 'vuex';
    import feed from '../../feed';

    export default {
        name: 'MessageLimit',
        props: ['user'],
        data() {
            return {
                limit: this.$store.state.config.daily_free_dialogs || 5,
                isBuying: false
            }
        },
        computed: {
            photoUrl() {
                return this.user.avatars.s5;
            },
            isMan() {
                return this.user.gender === GENDER_MAN;
            },
            information() {
                let pronouns = this.isMan ? this.$t('personal_pronouns.him') : this.$t('personal_pronouns.her');
                return this.$t('message_limit.info', {pronouns: pronouns, count: this.limit});
            },
            ...mapGetters('vip', ['trialIsAvailable'])
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Chat Request Limit', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Chat Request Limit': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {
                af_content_type: 'Chat Request Limit',
                ap_action: 'View'
            });

            this.$nativeStat.trackCommonEvent('chat_reach_request_limit');
            this.$nativeStat.trackAppsFlyerEvent('ap_chat_reach_request_limit');
        },
        methods: {
            showVipOffer() {
                this.$nav.back().then(() => {
                    feed.showVipFullOffer({source: SOURCE_VIP_CHAT_REQUEST_LIMIT});
                });

            }
        }
    }
</script>
