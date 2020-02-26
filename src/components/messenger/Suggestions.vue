<template>
    <div class="suggestions">
        <div class="suggestions__title" v-if="!hasContacts">{{$t('suggestions.title')}}</div>
        <div class="suggestions__subtitle" v-html="subtitle"></div>
        <div class="suggestions__users">
            <div class="suggestions__user" v-for="user in users" :key="user.id" @click="openChat(user)">
                <div class="suggestions__user-photo" :style="{backgroundImage: `url(${user.avatars.s2})`}"></div>
                <div class="suggestions__user-name ellipsis">{{user.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import feed from '@/feed/';
    import {GENDER_MAN} from '../../consts';
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: 'Suggestions',
        props: ['users'],
        computed: {
            subtitle() {
                return this.$t(this.isMan ? 'suggestions.subtitle_f' : 'suggestions.subtitle_m');
            },
            hasContacts() {
                return this.contacts.length;
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            },
            dialogLockedByDailyLimit() {
                if (this.hasVip) {
                    return false;
                }

                return !this.canOpenDialog;
            },
            ...mapState('vip', ['hasVip']),
            ...mapState('messenger', ['contacts']),
            ...mapGetters('feed', ['canOpenDialog'])
        },
        methods: {
            openChat(user) {
                if (this.dialogLockedByDailyLimit) {
                    feed.showMessageLimit(user);
                } else {
                    this.$nav.push('/app/messenger/' + user.id);
                }
            }
        }
    }
</script>
