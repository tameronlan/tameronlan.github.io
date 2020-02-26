<template>
    <div class="locked-user extend">
        <div class="locked-user__photo" :style="{backgroundImage: `url(${photoUrl})`}"></div>
        <div class="locked-user__title">
            <div class="locked-user__name">
                <span>{{userName}}</span><span v-if="item.user.online" class="online-status"></span>
            </div>
            {{title}}
        </div>
        <div class="locked-user__subtitle">
            <i class="ico ico_lock2"></i><br>
            {{subtitle}}
        </div>
        <button class="locked-user__btn-buy btn_primary btn_size-m btn_mw220" :disabled="isBuying" @click="showVipOffer"
                v-touch>
            {{$t('locked_user.btn_open')}}
        </button>
        <button class="btn_link btn_size-m btn_mw220" @click="gotoFeed" v-touch>{{$t('locked_user.btn_play')}}</button>
        <div class="locked-user__back" @click="$nav.back()"><i class="ico ico_exit"></i></div>
    </div>
</template>

<script>
    import {GENDER_MAN, SOURCE_VIP_LIKE_LOCKED} from '../../consts';
    import feed from '@/feed';

    export default {
        name: "LockedUser",
        props: ['item'],
        data() {
            return {
                isBuying: false
            }
        },
        computed: {
            photoUrl() {
                return this.item.user.avatars.s5;
            },
            userName() {
                return this.item.user.name.substr(0, 1) + '•••';
            },
            title() {
                let isMan = this.$store.state.config.user.gender === GENDER_MAN;
                let gender = isMan ? this.$t('locked_user.male') : this.$t('locked_user.female');
                return this.$t('locked_user.title', {gender: gender});
            },
            subtitle() {
                let isMan = this.item.user.gender === GENDER_MAN;
                let pronouns = isMan ? this.$t('personal_pronouns.him') : this.$t('personal_pronouns.her');
                return this.$t('locked_user.subtitle', {pronouns: pronouns});
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            }
        },
        mounted() {
            this.$nativeStat.trackFirebaseEvent('item_action', {screen: 'Like Locked', action: 'View'});
            this.$nativeStat.trackMetricaEvent('item_action', {'Like Locked': 'View'});
            this.$nativeStat.trackAppsFlyerEvent('fs_action', {af_content_type: 'Like Locked', ap_action: 'View'});
        },
        methods: {
            gotoFeed() {
                this.$nav.back().then(() => {
                    this.$nav.push('/app/feed');
                });
            },
            showVipOffer() {
                feed.showVipFullOffer({source: SOURCE_VIP_LIKE_LOCKED}).then((params = {}) => {
                    if (params.success) {
                        feed.openProfile({id: this.item.user.id}, true);
                    }
                });
            }
        }
    }
</script>
