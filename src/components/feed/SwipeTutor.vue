<template>
    <div class="swipe-tutor">
        <div class="swipe-tutor__head">
            <i class="ico" :class="[isRightSwipe ? 'ico_face-hearts' : 'ico_face-confused']"></i>
        </div>
        <div class="swipe-tutor__message">
            <i class="ico ico_pointign-up"></i>
            <div v-if="isRightSwipe" v-html="likeMessage"></div>
            <div v-else v-html="dislikeMessage"></div>
        </div>
        <div v-if="!isRightSwipe" class="swipe-tutor__sub-title" v-html="dislikeSubTittle"></div>
        <button class="btn_primary btn_size-m" @click="$nav.back()" v-touch>{{$t('swipe.btn')}}</button>
    </div>
</template>

<script>
    import {GENDER_MAN, DIRECTION_RIGHT} from "../../consts";

    export default {
        name: "SwipeTutor",
        props: ['card', 'dir'],
        computed: {
            likeMessage() {
                let pronouns = this.isMan ? this.$t('swipe.like_her') : this.$t('swipe.like_him');
                return this.$t('swipe.like', {pronouns: pronouns});
            },
            dislikeMessage() {
                let pronouns = this.isMan ? this.$t('swipe.like_her') : this.$t('swipe.like_him');
                return this.$t('swipe.dislike', {pronouns: pronouns});
            },
            dislikeSubTittle() {
                let pronouns = this.isMan ? this.$t('personal_pronouns.she') : this.$t('personal_pronouns.he');
                return this.$t('swipe.dislike_sub', {pronouns: pronouns});
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            },
            isRightSwipe() {
                return this.dir === DIRECTION_RIGHT;
            }
        },
    }
</script>
