<template>
    <div class="feed-limit">
        <div class="feed-limit__title" v-html="title"></div>
        <div class="feed-limit__message" v-html="$t('feed_limit.msg')"></div>
    </div>
</template>

<script>
    import {GENDER_MAN} from "../../consts";

    export default {
        name: 'FeedLimit',
        props: ['limitData'],
        computed: {
            title() {
                let gender = this.isMan ? this.$t('feed_limit.female') : this.$t('feed_limit.male');
                return this.$t('feed_limit.title', {gender: gender});
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            }
        }
    }
</script>
