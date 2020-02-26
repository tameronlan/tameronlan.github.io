<template>
    <div class="question">
        <div class="question__head">{{headText}}</div>
        <div class="question__title">{{question.question}}</div>
        <transition name="answer">
            <div class="question__answer" v-if="question.answer">{{question.answer.title}}</div>
        </transition>
    </div>
</template>

<script>
    import {GENDER_MAN} from '../../consts';

    export default {
        name: 'Question',
        props: ['question'],
        computed: {
            headText() {
                let partner = this.$t(this.isMan ? 'question.partner_female' : 'question.partner_male');
                return this.$t('question.head', {partner: partner});
            },
            isMan() {
                return this.$store.state.config.user.gender === GENDER_MAN;
            }
        }
    }
</script>
